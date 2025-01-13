package dev.zemco.schemalens.projects.collaborators

class ProjectCollaboratorDto(
    val username: String,
    val email: String,
    val role: ProjectCollaborationRole,
)
