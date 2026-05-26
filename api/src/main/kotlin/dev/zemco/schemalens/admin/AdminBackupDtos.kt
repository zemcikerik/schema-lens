package dev.zemco.schemalens.admin

import dev.zemco.schemalens.backup.BackupRunStatus
import dev.zemco.schemalens.backup.BackupTriggerType
import dev.zemco.schemalens.validation.CronExpressionConstraint
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import java.time.Instant

data class AdminBackupDto(
    val configuration: AdminBackupConfigurationDto,
    val runs: List<AdminBackupRunDto>,
)

data class AdminBackupConfigurationDto(
    val automaticEnabled: Boolean,
    val cronExpression: String,
    val retentionDays: Int,
    val oracleDirectoryName: String,
)

data class AdminUpdateBackupConfigurationDto(
    val automaticEnabled: Boolean,

    @field:NotBlank
    @field:CronExpressionConstraint
    val cronExpression: String,

    @field:Max(3650)
    val retentionDays: Int,

    @field:NotBlank
    @field:Pattern(regexp = "[A-Za-z][A-Za-z0-9_]{0,127}")
    val oracleDirectoryName: String,
)

data class AdminBackupRunDto(
    val id: Long,
    val startedAt: Instant,
    val finishedAt: Instant?,
    val status: BackupRunStatus,
    val triggerType: BackupTriggerType,
    val fileName: String?,
    val logFileName: String,
    val fileSizeBytes: Long?,
    val errorMessage: String?,
    val createdByUsername: String?,
)
