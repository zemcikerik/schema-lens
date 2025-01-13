package dev.zemco.schemalens.projects.collaborators

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

enum class ProjectCollaborationRole {
    OWNER,
    MANAGER,
    ADMIN,
    CONTRIBUTOR,
    VIEWER,
}

fun ProjectCollaborationRole.mapToCharacter(): Char =
    when (this) {
        ProjectCollaborationRole.OWNER -> 'O'
        ProjectCollaborationRole.MANAGER -> 'M'
        ProjectCollaborationRole.ADMIN -> 'A'
        ProjectCollaborationRole.CONTRIBUTOR -> 'C'
        ProjectCollaborationRole.VIEWER -> 'V'
    }

fun Char.mapToProjectCollaborationRole(): ProjectCollaborationRole? =
    when (this) {
        'O' -> ProjectCollaborationRole.OWNER
        'M' -> ProjectCollaborationRole.MANAGER
        'A' -> ProjectCollaborationRole.ADMIN
        'C' -> ProjectCollaborationRole.CONTRIBUTOR
        'V' -> ProjectCollaborationRole.VIEWER
        else -> null
    }

@Converter
class ProjectCollaborationRoleConverter : AttributeConverter<ProjectCollaborationRole, Char> {

    override fun convertToDatabaseColumn(role: ProjectCollaborationRole?): Char? =
        role?.mapToCharacter()

    override fun convertToEntityAttribute(rawRole: Char?): ProjectCollaborationRole? =
        rawRole?.mapToProjectCollaborationRole()

}
