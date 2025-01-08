package dev.zemco.schemalens.projects

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface ProjectCollaboratorRepository : CrudRepository<ProjectCollaborator, ProjectCollaborator.Id> {
    @Query("""
        SELECT pc
        FROM ProjectCollaborator pc
            INNER JOIN registered_user u ON (pc.user.id = u.id)
        WHERE pc.project.id = :projectId AND u.username = :username
    """)
    fun findByUsernameAndProjectId(username: String, projectId: Long): ProjectCollaborator?
}
