package dev.zemco.schemalens.backup

import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime

interface BackupRunRepository : CrudRepository<BackupRun, Long> {
    fun findTop15ByOrderByStartedAtDesc(): List<BackupRun>
    fun findByStartedAtBeforeAndStatusNot(startedAt: LocalDateTime, status: BackupRunStatus): List<BackupRun>
    fun findByStatus(status: BackupRunStatus): List<BackupRun>
    fun existsByStatus(status: BackupRunStatus): Boolean
}
