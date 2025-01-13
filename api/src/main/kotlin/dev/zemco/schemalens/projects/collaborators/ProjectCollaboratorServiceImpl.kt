package dev.zemco.schemalens.projects.collaborators

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.projects.Project
import org.springframework.stereotype.Service

@Service
class ProjectCollaboratorServiceImpl(
    private val projectCollaboratorRepository: ProjectCollaboratorRepository
) : ProjectCollaboratorService {

    override fun addCollaborator(project: Project, user: User, role: ProjectCollaborationRole): ProjectCollaborator? {
        if (role == ProjectCollaborationRole.OWNER) {
            throw IllegalArgumentException("Owner cannot be a collaborator")
        }

        if (project.ownerId == user.id || project.collaborators.any { it.id.userId == user.id }) {
            return null
        }

        return projectCollaboratorRepository.save(
            ProjectCollaborator(
            id = ProjectCollaborator.Id(
                projectId = project.id!!,
                userId = user.id!!
            ),
            project = project,
            user = user,
            role = role,
        )
        )
    }

    override fun deleteCollaborator(collaborator: ProjectCollaborator) =
        projectCollaboratorRepository.delete(collaborator)

    override fun getCollaboratorForProject(project: Project, username: String): ProjectCollaborator? =
        projectCollaboratorRepository.findByUsernameAndProjectId(username, project.id!!)

    override fun getCollaboratorsIncludingOwnerFor(project: Project): List<ProjectCollaborator> =
        sequence {
            yield(project.owner.let {
                ProjectCollaborator(
                    id = ProjectCollaborator.Id(
                        userId = it.id!!,
                        projectId = project.id!!
                    ),
                    user = it,
                    project = project,
                    role = ProjectCollaborationRole.OWNER,
                )
            })
            yieldAll(project.collaborators)
        }.toList()

    override fun saveCollaborator(collaborator: ProjectCollaborator): ProjectCollaborator =
        projectCollaboratorRepository.save(collaborator)

}
