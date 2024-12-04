package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import org.springframework.stereotype.Service
import java.util.*

@Service
class ProjectServiceImpl(
    private val projectRepository: ProjectRepository,
) : ProjectService {

    override fun getProjects(): List<Project> {
        return projectRepository.findAll().toList()
    }

    override fun getProjectByUuid(uuid: UUID): Project? =
        projectRepository.findByUuid(uuid)

    override fun getSecuredProjectByUuid(uuid: UUID, user: User): Project? {
        // TODO: check for user access
        return getProjectByUuid(uuid)
    }

    override fun deleteProjectByUuid(uuid: UUID) =
        projectRepository.deleteByUuid(uuid)

    override fun saveProject(project: Project): Project =
        projectRepository.save(project)

}
