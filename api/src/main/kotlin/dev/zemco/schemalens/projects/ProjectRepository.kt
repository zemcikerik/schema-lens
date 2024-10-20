package dev.zemco.schemalens.projects

import org.springframework.data.repository.CrudRepository
import java.util.UUID

interface ProjectRepository : CrudRepository<Project, Long> {
    fun findByUuid(uuid: UUID): Project?
}
