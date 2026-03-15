package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.auth.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank

@Entity
class DataModel(
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    @Column(name = "model_id")
    var id: Long? = null,

    @field:NotBlank
    @Column(nullable = false, length = 64)
    var name: String,

    @Column(name = "owner_id", nullable = false)
    var ownerId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false, insertable = false, updatable = false)
    var owner: User,
)
