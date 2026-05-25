package dev.zemco.schemalens.admin

import dev.zemco.schemalens.auth.UserWrapperDetails
import dev.zemco.schemalens.backup.BackupConfiguration
import dev.zemco.schemalens.backup.BackupRun
import dev.zemco.schemalens.backup.BackupRunStatus
import dev.zemco.schemalens.backup.BackupService
import dev.zemco.schemalens.backup.BackupTriggerType
import jakarta.validation.Valid
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/admin/backup")
class AdminBackupController(
    private val backupService: BackupService,
) {
    @GetMapping
    fun getBackup(): AdminBackupDto =
        AdminBackupDto(
            configuration = backupService.getConfiguration().mapToDto(),
            runs = backupService.getRuns().map { it.mapToDto() },
        )

    @PutMapping("/configuration")
    fun updateConfiguration(@RequestBody @Valid configurationDto: AdminUpdateBackupConfigurationDto): AdminBackupConfigurationDto {
        val configuration = BackupConfiguration(
            automaticEnabled = configurationDto.automaticEnabled,
            cronExpression = configurationDto.cronExpression,
            retentionDays = configurationDto.retentionDays,
            oracleDirectoryName = configurationDto.oracleDirectoryName,
        )
        return backupService.updateConfiguration(configuration).mapToDto()
    }

    @PostMapping("/run")
    fun runBackup(@AuthenticationPrincipal userDetails: UserWrapperDetails): AdminBackupRunDto =
        backupService.runBackup(BackupTriggerType.MANUAL, userDetails.user).mapToDto()

    @GetMapping("/runs")
    fun getRuns(): List<AdminBackupRunDto> =
        backupService.getRuns().map { it.mapToDto() }

    @GetMapping("/runs/{runId}/download")
    fun download(@PathVariable runId: Long): ResponseEntity<Resource> =
        backupService.getBackupFile(runId)?.let { (run, resource) ->
            ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${run.fileName}\"")
                .body(resource)
        } ?: ResponseEntity.notFound().build()

    @GetMapping("/runs/{runId}/log/download")
    fun downloadLog(@PathVariable runId: Long): ResponseEntity<Resource> =
        backupService.getBackupLogFile(runId)?.let { (run, resource) ->
            ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${run.logFileName}\"")
                .body(resource)
        } ?: ResponseEntity.notFound().build()

    @DeleteMapping("/runs/{runId}")
    fun deleteRun(@PathVariable runId: Long): ResponseEntity<Any> =
        if (backupService.deleteRun(runId)) ResponseEntity.noContent().build() else ResponseEntity.notFound().build()

    private fun BackupConfiguration.mapToDto(): AdminBackupConfigurationDto =
        AdminBackupConfigurationDto(
            automaticEnabled = automaticEnabled,
            cronExpression = cronExpression,
            retentionDays = retentionDays,
            oracleDirectoryName = oracleDirectoryName,
        )

    private fun BackupRun.mapToDto(): AdminBackupRunDto =
        AdminBackupRunDto(
            id = id!!,
            startedAt = startedAt,
            finishedAt = finishedAt,
            status = status,
            triggerType = triggerType,
            fileName = fileName.takeUnless { status == BackupRunStatus.FAILED },
            logFileName = logFileName,
            fileSizeBytes = fileSizeBytes,
            errorMessage = errorMessage,
            createdByUsername = createdBy?.username,
        )
}
