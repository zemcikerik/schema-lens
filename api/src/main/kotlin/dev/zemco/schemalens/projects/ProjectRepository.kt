package dev.zemco.schemalens.projects

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

interface ProjectRepository : CrudRepository<Project, Long> {
    fun findByUuid(uuid: UUID): Project?

    @Query("""
        SELECT NEW kotlin.Pair(p, 'O')
        FROM Project p
        WHERE p.ownerId = :userId
        UNION ALL
        SELECT new kotlin.Pair(p, CAST(pc.role as char))
        FROM Project p
            INNER JOIN ProjectCollaborator pc ON (p.id = pc.project.id)
        WHERE p.ownerId <> :userId AND pc.user.id = :userId
    """)
    fun findAllByOwnership(userId: Long): List<Pair<Project, String>>

    @Query("""
        SELECT new kotlin.Pair(p, 'O')
        FROM Project p
        WHERE p.uuid = :uuid AND p.ownerId = :userId
        UNION ALL
        SELECT new kotlin.Pair(p, CAST(pc.role as char))
        FROM Project p
            INNER JOIN ProjectCollaborator pc ON (p.id = pc.project.id)
        WHERE p.uuid = :uuid AND p.ownerId <> :userId AND pc.user.id = :userId
    """)
    fun findByUuidAndOwnership(uuid: UUID, userId: Long): Pair<Project, String>?

    @Transactional
    fun deleteByUuid(uuid: UUID)
}
