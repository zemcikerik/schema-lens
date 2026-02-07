package dev.zemco.schemalens.modeling.logical

import dev.zemco.schemalens.modeling.DataModel
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.CascadeType

@Entity
class DataModelRelationship(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "relationship_id")
    var id: Long? = null,

    @Column(name = "model_id", nullable = false)
    var modelId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "model_id", nullable = false, insertable = false, updatable = false)
    var model: DataModel,

    @Column(name = "from_entity_id", nullable = false)
    var fromEntityId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_entity_id", nullable = false, insertable = false, updatable = false)
    var fromEntity: DataModelEntity,

    @Column(name = "to_entity_id", nullable = false)
    var toEntityId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_entity_id", nullable = false, insertable = false, updatable = false)
    var toEntity: DataModelEntity,

    @Column(nullable = false)
    @Convert(DataModelRelationshipTypeConverter::class)
    var type: DataModelRelationshipType,

    @Column(nullable = false)
    var isMandatory: Boolean,

    @Column(nullable = false)
    var isIdentifying: Boolean,

    @OneToMany(
        mappedBy = "relationship",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    var attributes: MutableList<DataModelRelationshipAttribute> = mutableListOf(),
)
