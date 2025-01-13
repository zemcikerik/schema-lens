package dev.zemco.schemalens.projects.collaborators

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.projects.Project
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

@Entity
class ProjectCollaborator(
    @EmbeddedId
    var id: Id,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false, insertable = false, updatable = false)
    var project: Project,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    var user: User,

    @NotNull
    @Convert(converter = ProjectCollaborationRoleConverter::class)
    var role: ProjectCollaborationRole,
) {
    @Embeddable
    data class Id(
        @Column(name = "project_id", nullable = false)
        var projectId: Long,

        @Column(name = "user_id", nullable = false)
        var userId: Long,
    )
}
