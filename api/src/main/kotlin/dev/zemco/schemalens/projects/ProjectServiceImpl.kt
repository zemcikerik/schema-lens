package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import org.springframework.stereotype.Service
import java.util.*

@Service
class ProjectServiceImpl(
    private val projectRepository: ProjectRepository,
) : ProjectService {

    override fun getProjects(): List<Project> =
        projectRepository.findAll().toList()

    override fun getProjectByUuid(uuid: UUID): Project? =
        projectRepository.findByUuid(uuid)

    override fun getSecuredProjects(user: User): List<Project> =
        projectRepository.findAllByOwnership(user.id!!).map { it.unwrapRole() }

    override fun getSecuredProjectByUuid(uuid: UUID, user: User): Project? =
        projectRepository.findByUuidAndOwnership(uuid, user.id!!)?.unwrapRole()

    override fun deleteProjectByUuid(uuid: UUID) =
        projectRepository.deleteByUuid(uuid)

    override fun saveProject(project: Project): Project =
        projectRepository.save(project)

    private fun Pair<Project, String>.unwrapRole(): Project =
        first.also { it.role = second[0].mapToProjectCollaborationRole() }

}
