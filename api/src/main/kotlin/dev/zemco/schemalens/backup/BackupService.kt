package dev.zemco.schemalens.backup

import dev.zemco.schemalens.auth.User
import org.springframework.core.io.Resource

interface BackupService {
    fun getConfiguration(): BackupConfiguration
    fun updateConfiguration(configuration: BackupConfiguration): BackupConfiguration
    fun getRuns(): List<BackupRun>
    fun recoverInterruptedRuns()
    fun runBackup(triggerType: BackupTriggerType, createdBy: User? = null): BackupRun
    fun getBackupFile(runId: Long): Pair<BackupRun, Resource>?
    fun getBackupLogFile(runId: Long): Pair<BackupRun, Resource>?
    fun deleteRun(runId: Long): Boolean
    fun runScheduledBackup()
}
