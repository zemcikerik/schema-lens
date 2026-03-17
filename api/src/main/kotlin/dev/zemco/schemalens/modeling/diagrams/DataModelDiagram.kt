package dev.zemco.schemalens.modeling.diagrams

import dev.zemco.schemalens.modeling.models.DataModel
import jakarta.persistence.CascadeType
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
import jakarta.validation.constraints.NotBlank

@Entity
class DataModelDiagram(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "model_id", nullable = false)
    var modelId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "model_id", nullable = false, insertable = false, updatable = false)
    var model: DataModel,

    @field:NotBlank
    @Column(nullable = false, length = 64)
    var name: String,

    @Column(nullable = false)
    @Convert(converter = DataModelDiagramTypeConverter::class)
    var type: DataModelDiagramType = DataModelDiagramType.LOGICAL,

    @OneToMany(mappedBy = "diagram", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    var nodes: MutableSet<DataModelDiagramNode> = mutableSetOf(),

    @OneToMany(mappedBy = "diagram", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    var edges: MutableSet<DataModelDiagramEdge> = mutableSetOf(),
)
