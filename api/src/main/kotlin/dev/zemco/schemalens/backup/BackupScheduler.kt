package dev.zemco.schemalens.backup

import jakarta.annotation.PreDestroy
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.support.CronTrigger
import org.springframework.stereotype.Component
import java.time.ZoneOffset
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

@Component
class BackupScheduler(
    private val backupService: BackupService,
    @param:Qualifier("backupTaskScheduler") private val taskScheduler: TaskScheduler,
) {
    private val scheduleLock = ReentrantLock()
    private var scheduledBackup: ScheduledFuture<*>? = null

    @EventListener(ApplicationReadyEvent::class)
    fun start() {
        backupService.recoverInterruptedRuns()
        reschedule(backupService.getConfiguration())
    }

    @EventListener
    fun onBackupConfigurationUpdated(event: BackupConfigurationUpdatedEvent) = reschedule(event.configuration)

    @PreDestroy
    fun stop() = scheduleLock.withLock {
        scheduledBackup?.cancel(false)
        scheduledBackup = null
    }

    private fun reschedule(configuration: BackupConfiguration) {
        val trigger = configuration
            .takeIf { it.automaticEnabled }
            ?.let { CronTrigger(it.cronExpression, ZoneOffset.UTC) }

        scheduleLock.withLock {
            scheduledBackup?.cancel(false)
            scheduledBackup = null

            if (trigger == null) {
                LOGGER.info("Automatic backups are disabled as no backup schedule is registered")
                return
            }

            scheduledBackup = taskScheduler.schedule({ backupService.runScheduledBackup() }, trigger)
            LOGGER.info("Registered backup schedule with cron expression '{}'", configuration.cronExpression)
        }
    }

    companion object {
        private val LOGGER = LoggerFactory.getLogger(BackupScheduler::class.java)
    }
}
