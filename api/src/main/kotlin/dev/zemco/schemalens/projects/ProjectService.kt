package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import java.util.*

interface ProjectService {
    fun getProjects(): List<Project>
    fun getProjectByUuid(uuid: UUID): Project?
    fun getSecuredProjectByUuid(uuid: UUID, user: User): Project?
}
