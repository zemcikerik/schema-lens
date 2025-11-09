package dev.zemco.schemalens.modeling.logical

import dev.zemco.schemalens.modeling.DataModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.validation.constraints.NotBlank

@Entity
class DataModelEntity(
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    @Column(name = "entity_id")
    var id: Long? = null,

    @Column(name = "model_id", nullable = false)
    var modelId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "model_id", nullable = false, insertable = false, updatable = false)
    var model: DataModel,

    @field:NotBlank
    @Column(nullable = false, length = 30)
    var name: String,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "entity", orphanRemoval = true)
    var attributes: MutableList<DataModelAttribute> = mutableListOf(),
)
