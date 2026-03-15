package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.modeling.nodes.DataModelField
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.validation.constraints.NotBlank

@Entity
class DataModelEdgeField(
    @EmbeddedId
    var id: Id,

    @MapsId("edgeId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "edge_id", nullable = false)
    var edge: DataModelEdge,

    @MapsId("referencedFieldId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "referenced_field_id", nullable = false)
    var referencedField: DataModelField,

    @field:NotBlank
    @Column(nullable = false, length = 30)
    var name: String,

    @Column(nullable = false)
    var position: Short,
) {
    @Embeddable
    data class Id(
        @Column(name = "edge_id", nullable = false)
        var edgeId: Long,

        @Column(name = "referenced_field_id", nullable = false)
        var referencedFieldId: Long,
    )
}
