package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import java.util.*

interface ProjectService {
    fun getProjects(): List<Project>
    fun getProjectByUuid(uuid: UUID): Project?
    fun getSecuredProjects(user: User): List<Project>
    fun getSecuredProjectByUuid(uuid: UUID, user: User): Project?
    fun deleteProjectByUuid(uuid: UUID)
    fun saveProject(project: Project): Project
}
