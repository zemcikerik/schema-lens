package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.types.DataModelDataType

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
class DataModelField(
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    @Column(name = "field_id")
    var id: Long? = null,

    @Column(name = "node_id", nullable = false)
    var nodeId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "node_id", nullable = false, insertable = false, updatable = false)
    var node: DataModelNode,

    @field:NotBlank
    @Column(nullable = false, length = 30)
    var name: String,

    @Column(name = "type_id", nullable = false)
    var typeId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "type_id", nullable = false, insertable = false, updatable = false)
    var type: DataModelDataType,

    @Column(nullable = false)
    var isPrimaryKey: Boolean,

    @Column(nullable = false)
    var isNullable: Boolean,

    @Column(nullable = false)
    var position: Short,
)
