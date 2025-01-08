package dev.zemco.schemalens.projects

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

enum class ProjectCollaborationRole {
    OWNER,
    MANAGER,
    ADMIN,
    CONTRIBUTOR,
    VIEWER,
}

@Converter
class ProjectCollaborationRoleConverter : AttributeConverter<ProjectCollaborationRole, Char> {

    override fun convertToDatabaseColumn(role: ProjectCollaborationRole?): Char? =
        when (role) {
            ProjectCollaborationRole.OWNER -> 'O'
            ProjectCollaborationRole.MANAGER -> 'M'
            ProjectCollaborationRole.ADMIN -> 'A'
            ProjectCollaborationRole.CONTRIBUTOR -> 'C'
            ProjectCollaborationRole.VIEWER -> 'V'
            null -> null
        }

    override fun convertToEntityAttribute(rawRole: Char?): ProjectCollaborationRole? =
        when (rawRole) {
            'O' -> ProjectCollaborationRole.OWNER
            'M' -> ProjectCollaborationRole.MANAGER
            'A' -> ProjectCollaborationRole.ADMIN
            'C' -> ProjectCollaborationRole.CONTRIBUTOR
            'V' -> ProjectCollaborationRole.VIEWER
            else -> null
        }

}
