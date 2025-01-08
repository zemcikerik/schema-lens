package dev.zemco.schemalens.projects

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

interface ProjectRepository : CrudRepository<Project, Long> {
    fun findByUuid(uuid: UUID): Project?

    @Query("""
        SELECT p
        FROM Project p
        WHERE p.ownerId = :userId OR p.id IN (
            SELECT pc.project.id
            FROM ProjectCollaborator pc
            WHERE pc.user.id = :userId
        )
    """)
    fun findAllByOwnership(userId: Long): List<Project>

    @Query("""
        SELECT p
        FROM Project p
            LEFT JOIN ProjectCollaborator pc ON (p.id = pc.project.id)
        WHERE p.uuid = :uuid AND (p.ownerId = :userId OR pc.user.id = :userId)
    """)
    fun findByUuidAndOwnership(uuid: UUID, userId: Long): Project?

    @Transactional
    fun deleteByUuid(uuid: UUID)
}
