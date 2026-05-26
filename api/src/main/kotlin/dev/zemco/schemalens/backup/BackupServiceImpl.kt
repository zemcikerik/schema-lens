package dev.zemco.schemalens.backup

import dev.zemco.schemalens.auth.User
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.ApplicationEventPublisher
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.concurrent.ExecutorService
import java.util.concurrent.Semaphore

@Service
class BackupServiceImpl(
    private val configurationRepository: BackupConfigurationRepository,
    private val runRepository: BackupRunRepository,
    private val backupExecutor: BackupExecutor,
    private val applicationEventPublisher: ApplicationEventPublisher,
    @param:Qualifier("backupTaskExecutor") private val taskExecutor: ExecutorService,
) : BackupService {
    private val runSemaphore = Semaphore(1)
    private val fileNameTimestampFormatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss").withZone(ZoneOffset.UTC)

    override fun getConfiguration(): BackupConfiguration =
        configurationRepository.findById(BackupConfiguration.DEFAULT_ID).orElse(null)
            ?: configurationRepository.save(BackupConfiguration()).also {
                LOGGER.info("Created default backup configuration")
            }

    override fun updateConfiguration(configuration: BackupConfiguration): BackupConfiguration =
        configurationRepository.save(configuration.normalized()).also {
            LOGGER.info(
                "Updated backup configuration: automaticEnabled={}, cronExpression='{}', retentionDays={}, oracleDirectoryName='{}'",
                it.automaticEnabled,
                it.cronExpression,
                it.retentionDays,
                it.oracleDirectoryName,
            )
            applicationEventPublisher.publishEvent(BackupConfigurationUpdatedEvent(it))
        }

    override fun getRuns(): List<BackupRun> = runRepository.findTop15ByOrderByStartedAtDesc()

    override fun recoverInterruptedRuns() {
        val runningRuns = runRepository.findByStatus(BackupRunStatus.RUNNING)
        if (runningRuns.isEmpty()) {
            return
        }

        LOGGER.warn("Recovering {} interrupted backup run(s) left RUNNING by a previous application process", runningRuns.size)

        runningRuns.forEach { run ->
            val jobName = "SL_BKP_${run.id}"
            val cleanupMessage = cleanupInterruptedJob(jobName)

            run.apply {
                status = BackupRunStatus.FAILED
                finishedAt = Instant.now()
                errorMessage = cleanupMessage
            }
            runRepository.save(run)

            LOGGER.warn("Marked interrupted backup run id={} as FAILED: {}", run.id, cleanupMessage)
        }
    }

    override fun runBackup(triggerType: BackupTriggerType, createdBy: User?): BackupRun {
        if (!runSemaphore.tryAcquire()) {
            LOGGER.warn("Rejected {} backup trigger because another backup operation is locked", triggerType)
            throw BackupAlreadyRunningException()
        }

        try {
            if (runRepository.existsByStatus(BackupRunStatus.RUNNING)) {
                LOGGER.warn("Rejected {} backup trigger because a backup run is already marked RUNNING", triggerType)
                throw BackupAlreadyRunningException()
            }

            val now = Instant.now()
            val baseFileName = "schema_lens_${fileNameTimestampFormatter.format(now)}"
            val run = runRepository.save(BackupRun(
                startedAt = now,
                triggerType = triggerType,
                fileName = "$baseFileName.dmp",
                logFileName = "$baseFileName.log",
                oracleDirectoryName = getConfiguration().oracleDirectoryName,
                createdBy = createdBy,
            ))
            LOGGER.info(
                "Accepted backup run id={}, triggerType={}, fileName='{}', logFileName='{}', createdBy='{}'",
                run.id,
                run.triggerType,
                run.fileName,
                run.logFileName,
                createdBy?.username,
            )

            taskExecutor.execute { executeBackupRun(run.id!!) }

            return run
        } catch (ex: Exception) {
            runSemaphore.release()
            throw ex
        }
    }

    private fun executeBackupRun(runId: Long) {
        try {
            val run = runRepository.findById(runId).orElse(null) ?: run {
                LOGGER.warn("Backup run id={} disappeared before execution", runId)
                return
            }
            val jobName = "SL_BKP_$runId"

            try {
                backupExecutor.dumpSchema(run.oracleDirectoryName, run.fileName, run.logFileName, jobName)

                run.apply {
                    status = BackupRunStatus.SUCCESS
                    fileSizeBytes = backupExecutor.getFileSize(oracleDirectoryName, fileName)
                    finishedAt = Instant.now()
                }
                LOGGER.info("Finished backup run id={} with status={}, fileSizeBytes={}", run.id, run.status, run.fileSizeBytes)
            } catch (ex: Exception) {
                run.apply {
                    status = BackupRunStatus.FAILED
                    errorMessage = ex.message?.take(2048) ?: ex.javaClass.simpleName
                    finishedAt = Instant.now()
                }
                LOGGER.error("Finished backup run id={} with status={}: {}", run.id, run.status, run.errorMessage, ex)
            }

            runRepository.save(run)
            cleanupExpiredRuns()
        } finally {
            runSemaphore.release()
        }
    }

    private fun cleanupInterruptedJob(jobName: String): String =
        try {
            if (backupExecutor.cleanupInterruptedJob(jobName)) {
                "Backup was interrupted by application shutdown or restart. Oracle Data Pump job '$jobName' was stopped."
            } else {
                "Backup was interrupted by application shutdown or restart, No Oracle Data Pump job '$jobName' was found."
            }
        } catch (ex: Exception) {
            LOGGER.warn("Failed to cleanup interrupted Oracle Data Pump jobName='{}'", jobName, ex)
            "Backup was interrupted by application shutdown or restart. Failed to stop Oracle Data Pump job '$jobName': ${ex.message?.take(512) ?: ex.javaClass.simpleName}"
        }

    override fun getBackupFile(runId: Long): Pair<BackupRun, Resource>? =
        getBackupRunFile(
            runId = runId,
            fileDescription = "backup file",
            isAvailable = { it.status == BackupRunStatus.SUCCESS },
            fileName = { it.fileName },
        )

    override fun getBackupLogFile(runId: Long): Pair<BackupRun, Resource>? =
        getBackupRunFile(
            runId = runId,
            fileDescription = "backup log",
            isAvailable = { it.status != BackupRunStatus.RUNNING },
            fileName = { it.logFileName },
        )

    override fun deleteRun(runId: Long): Boolean {
        val run = runRepository.findById(runId).orElse(null) ?: run {
            LOGGER.warn("Delete requested for missing backup run id={}", runId)
            return false
        }

        LOGGER.info("Deleting backup run id={}, fileName='{}', logFileName='{}'", run.id, run.fileName, run.logFileName)

        backupExecutor.deleteFileIfExists(run.oracleDirectoryName, run.fileName)
        backupExecutor.deleteFileIfExists(run.oracleDirectoryName, run.logFileName)
        runRepository.delete(run)

        LOGGER.info("Deleted backup run id={}", runId)
        return true
    }

    private fun getBackupRunFile(
        runId: Long,
        fileDescription: String,
        isAvailable: (BackupRun) -> Boolean,
        fileName: (BackupRun) -> String,
    ): Pair<BackupRun, Resource>? {
        val run = runRepository.findById(runId).orElse(null)
        if (run == null || !isAvailable(run)) {
            LOGGER.warn("{} download requested for unavailable run id={}", fileDescription, runId)
            return null
        }

        val selectedFileName = fileName(run)
        val resource = backupExecutor.getFile(run.oracleDirectoryName, selectedFileName)
        if (resource == null) {
            LOGGER.warn("{} download requested for run id={}, but file '{}' is missing", fileDescription, run.id, selectedFileName)
            return null
        }

        LOGGER.info("Prepared {} download for run id={}, fileName='{}'", fileDescription, run.id, selectedFileName)
        return run to resource
    }

    override fun runScheduledBackup() {
        val configuration = getConfiguration()
        if (!configuration.automaticEnabled) {
            LOGGER.debug("Skipped scheduled backup because automatic backups are disabled")
            return
        }

        if (runSemaphore.availablePermits() == 0 || runRepository.existsByStatus(BackupRunStatus.RUNNING)) {
            LOGGER.info("Skipped scheduled backup because another backup is already running")
            return
        }

        LOGGER.info("Triggering scheduled backup")
        runBackup(BackupTriggerType.SCHEDULED)
    }

    private fun BackupConfiguration.normalized(): BackupConfiguration =
        BackupConfiguration(
            id = BackupConfiguration.DEFAULT_ID,
            automaticEnabled = automaticEnabled,
            cronExpression = cronExpression.trim(),
            retentionDays = retentionDays,
            oracleDirectoryName = oracleDirectoryName.trim().uppercase(),
        )

    private fun cleanupExpiredRuns() {
        val configuration = getConfiguration()

        if (!configuration.automaticEnabled) {
            LOGGER.debug("Skipped backup retention cleanup because automatic backups are disabled")
            return
        }

        if (configuration.retentionDays <= 0) {
            LOGGER.debug("Skipped backup retention cleanup because retention is disabled")
            return
        }

        val retentionDays = configuration.retentionDays
        val threshold = Instant.now().minus(retentionDays.toLong(), ChronoUnit.DAYS)

        runRepository.findByStartedAtBeforeAndStatusNot(threshold, BackupRunStatus.RUNNING).forEach {
            LOGGER.info("Deleting expired backup run id={} older than {} days", it.id, retentionDays)
            deleteRun(it.id!!)
        }
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(BackupServiceImpl::class.java)
    }
}
