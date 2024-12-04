package dev.zemco.schemalens.projects

import org.springframework.data.repository.CrudRepository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

interface ProjectRepository : CrudRepository<Project, Long> {
    fun findByUuid(uuid: UUID): Project?

    @Transactional
    fun deleteByUuid(uuid: UUID)
}
