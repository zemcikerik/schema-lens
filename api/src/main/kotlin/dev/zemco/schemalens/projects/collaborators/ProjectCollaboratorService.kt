package dev.zemco.schemalens.projects.collaborators

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.projects.Project

interface ProjectCollaboratorService {
    fun addCollaborator(project: Project, user: User, role: ProjectCollaborationRole): ProjectCollaborator?
    fun deleteCollaborator(collaborator: ProjectCollaborator)
    fun getCollaboratorForProject(project: Project, username: String): ProjectCollaborator?
    fun getCollaboratorsIncludingOwnerFor(project: Project): List<ProjectCollaborator>
    fun saveCollaborator(collaborator: ProjectCollaborator): ProjectCollaborator
}
