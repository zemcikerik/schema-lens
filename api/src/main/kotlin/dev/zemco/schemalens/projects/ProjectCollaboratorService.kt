package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User

interface ProjectCollaboratorService {
    fun addCollaborator(project: Project, user: User, role: ProjectCollaborationRole): ProjectCollaborator?
    fun deleteCollaborator(collaborator: ProjectCollaborator)
    fun getCollaboratorForProject(project: Project, username: String): ProjectCollaborator?
    fun getCollaboratorsIncludingOwnerFor(project: Project): List<ProjectCollaborator>
    fun saveCollaborator(collaborator: ProjectCollaborator): ProjectCollaborator
}
