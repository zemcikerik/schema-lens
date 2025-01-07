package dev.zemco.schemalens.projects

import org.springframework.data.repository.CrudRepository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

interface ProjectRepository : CrudRepository<Project, Long> {
    fun findByUuid(uuid: UUID): Project?
    fun findByUuidAndOwnerId(uuid: UUID, ownerId: Long): Project?
    fun findByOwnerId(ownerId: Long): List<Project>

    @Transactional
    fun deleteByUuid(uuid: UUID)
}
