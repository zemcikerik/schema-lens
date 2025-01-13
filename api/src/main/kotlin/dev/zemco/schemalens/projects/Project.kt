package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import jakarta.persistence.*
import java.util.*

@Entity
class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var uuid: UUID = UUID.randomUUID(),

    @Column(nullable = false, length = 64)
    var name: String,

    @Column(name = "owner_id", nullable = false)
    var ownerId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false, insertable = false, updatable = false)
    var owner: User,

    @OneToOne(mappedBy = "project", optional = true, fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var connectionInfo: ProjectConnectionInfo,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", orphanRemoval = true)
    var collaborators: MutableList<ProjectCollaborator> = mutableListOf(),

    @Transient
    var role: ProjectCollaborationRole? = null,
)
