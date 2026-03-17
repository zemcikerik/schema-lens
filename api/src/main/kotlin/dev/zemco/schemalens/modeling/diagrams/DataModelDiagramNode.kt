package dev.zemco.schemalens.modeling.diagrams

import dev.zemco.schemalens.modeling.nodes.DataModelNode
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId

@Entity
class DataModelDiagramNode(
    @EmbeddedId
    var id: Id,

    @MapsId("diagramId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "diagram_id", nullable = false)
    var diagram: DataModelDiagram,

    @MapsId("nodeId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "node_id", nullable = false)
    var node: DataModelNode,

    @Column(nullable = false)
    var x: Double,

    @Column(nullable = false)
    var y: Double,

    @Column(nullable = false)
    var width: Double,

    @Column(nullable = false)
    var height: Double,
) {
    @Embeddable
    data class Id(
        @Column(name = "diagram_id", nullable = false)
        var diagramId: Long,

        @Column(name = "node_id", nullable = false)
        var nodeId: Long,
    )
}
