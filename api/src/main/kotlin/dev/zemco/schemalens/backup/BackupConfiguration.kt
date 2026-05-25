package dev.zemco.schemalens.backup

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
class BackupConfiguration(
    @Id
    var id: Long = DEFAULT_ID,

    @Column(nullable = false)
    var automaticEnabled: Boolean = false,

    @Column(nullable = false, length = 128)
    var cronExpression: String = "0 0 2 * * *",

    @Column(nullable = false)
    var retentionDays: Int = 30,

    @Column(nullable = false, length = 128)
    var oracleDirectoryName: String = "SCHEMA_LENS_BACKUP_DIR",
) {
    companion object {
        const val DEFAULT_ID = 1L
    }
}
