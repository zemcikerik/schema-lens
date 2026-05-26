package dev.zemco.schemalens.backup

import dev.zemco.schemalens.auth.User
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import java.time.Instant

@Entity(name = "backup_run")
class BackupRun(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var startedAt: Instant = Instant.now(),

    var finishedAt: Instant? = null,

    @Convert(converter = BackupRunStatusConverter::class)
    @Column(nullable = false, length = 1)
    var status: BackupRunStatus = BackupRunStatus.RUNNING,

    @Convert(converter = BackupTriggerTypeConverter::class)
    @Column(nullable = false, length = 1)
    var triggerType: BackupTriggerType,

    @Column(nullable = false, length = 255)
    var fileName: String,

    @Column(nullable = false, length = 255)
    var logFileName: String,

    @Column(nullable = false, length = 128)
    var oracleDirectoryName: String,

    var fileSizeBytes: Long? = null,

    @Column(length = 2048)
    var errorMessage: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", referencedColumnName = "id", nullable = false, updatable = false)
    var createdBy: User? = null,
)
