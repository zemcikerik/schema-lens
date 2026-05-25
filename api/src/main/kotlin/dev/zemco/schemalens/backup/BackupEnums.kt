package dev.zemco.schemalens.backup

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

enum class BackupRunStatus {
    RUNNING,
    SUCCESS,
    FAILED,
}

enum class BackupTriggerType {
    MANUAL,
    SCHEDULED,
}

fun BackupRunStatus.mapToCharacter(): Char =
    when (this) {
        BackupRunStatus.RUNNING -> 'R'
        BackupRunStatus.SUCCESS -> 'S'
        BackupRunStatus.FAILED -> 'F'
    }

fun Char.mapToBackupRunStatus(): BackupRunStatus =
    when (this) {
        'R' -> BackupRunStatus.RUNNING
        'S' -> BackupRunStatus.SUCCESS
        'F' -> BackupRunStatus.FAILED
        else -> throw IllegalArgumentException("Invalid backup run status '$this'")
    }

@Converter
class BackupRunStatusConverter : AttributeConverter<BackupRunStatus, Char> {

    override fun convertToDatabaseColumn(attribute: BackupRunStatus?): Char? =
        attribute?.mapToCharacter()

    override fun convertToEntityAttribute(dbData: Char?): BackupRunStatus? =
        dbData?.mapToBackupRunStatus()

}

fun BackupTriggerType.mapToCharacter(): Char =
    when (this) {
        BackupTriggerType.MANUAL -> 'M'
        BackupTriggerType.SCHEDULED -> 'S'
    }

fun Char.mapToBackupTriggerType(): BackupTriggerType =
    when (this) {
        'M' -> BackupTriggerType.MANUAL
        'S' -> BackupTriggerType.SCHEDULED
        else -> throw IllegalArgumentException("Invalid backup trigger type '$this'")
    }

@Converter
class BackupTriggerTypeConverter : AttributeConverter<BackupTriggerType, Char> {

    override fun convertToDatabaseColumn(attribute: BackupTriggerType?): Char? =
        attribute?.mapToCharacter()

    override fun convertToEntityAttribute(dbData: Char?): BackupTriggerType? =
        dbData?.mapToBackupTriggerType()

}
