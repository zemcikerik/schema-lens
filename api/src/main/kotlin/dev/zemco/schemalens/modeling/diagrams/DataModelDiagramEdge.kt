package dev.zemco.schemalens.modeling.diagrams

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.zemco.schemalens.modeling.edges.DataModelEdge
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Converter
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.Lob
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId

@Entity
class DataModelDiagramEdge(
    @EmbeddedId
    var id: Id,

    @MapsId("diagramId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "diagram_id", nullable = false)
    var diagram: DataModelDiagram,

    @MapsId("edgeId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "edge_id", nullable = false)
    var edge: DataModelEdge,

    @Lob
    @Convert(converter = PointsConverter::class)
    @Column(nullable = false)
    var points: List<Point>,
) {
    @Embeddable
    data class Id(
        @Column(name = "diagram_id", nullable = false)
        var diagramId: Long,

        @Column(name = "edge_id", nullable = false)
        var edgeId: Long,
    )

    data class Point(val x: Double, val y: Double)

    @Converter
    class PointsConverter : AttributeConverter<List<Point>, String> {

        override fun convertToDatabaseColumn(attribute: List<Point>?): String? =
            attribute?.let { mapper.writeValueAsString(it) }

        override fun convertToEntityAttribute(dbData: String?): List<Point>? =
            dbData?.let { mapper.readValue(it, object : TypeReference<List<Point>>() {}) }

        private companion object {
            val mapper = jacksonObjectMapper()
        }
    }
}
