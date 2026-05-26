package dev.zemco.schemalens.backup

import org.springframework.data.repository.CrudRepository
import java.time.Instant

interface BackupRunRepository : CrudRepository<BackupRun, Long> {
    fun findTop15ByOrderByStartedAtDesc(): List<BackupRun>
    fun findByStartedAtBeforeAndStatusNot(startedAt: Instant, status: BackupRunStatus): List<BackupRun>
    fun findByStatus(status: BackupRunStatus): List<BackupRun>
    fun existsByStatus(status: BackupRunStatus): Boolean
}
