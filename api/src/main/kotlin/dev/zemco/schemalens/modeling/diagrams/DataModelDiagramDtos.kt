package dev.zemco.schemalens.modeling.diagrams

import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelDiagramNodeDto(
    val nodeId: Long,
    val x: Double,
    val y: Double,
    val width: Double,
    val height: Double,
)

data class DataModelDiagramEdgePointDto(
    val x: Double,
    val y: Double,
)

data class DataModelDiagramEdgeDto(
    val edgeId: Long,
    val points: List<DataModelDiagramEdgePointDto>,
)

data class DataModelDiagramSimpleDto(
    val id: Long,
    val name: String,
    val type: DataModelDiagramType,
) {
    companion object {
        fun from(diagram: DataModelDiagram): DataModelDiagramSimpleDto =
            DataModelDiagramSimpleDto(
                id = diagram.id!!,
                name = diagram.name,
                type = diagram.type,
            )
    }
}

data class DataModelDiagramDto(
    val id: Long,
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String,
    val type: DataModelDiagramType,
    val nodes: List<DataModelDiagramNodeDto>,
    val edges: List<DataModelDiagramEdgeDto>,
) {
    companion object {
        fun from(diagram: DataModelDiagram): DataModelDiagramDto =
            DataModelDiagramDto(
                id = diagram.id!!,
                name = diagram.name,
                type = diagram.type,
                nodes = diagram.nodes.map {
                    DataModelDiagramNodeDto(
                        nodeId = it.id.nodeId,
                        x = it.x,
                        y = it.y,
                        width = it.width,
                        height = it.height,
                    )
                },
                edges = diagram.edges.map {
                    DataModelDiagramEdgeDto(
                        edgeId = it.id.edgeId,
                        points = it.points.map { point ->
                            DataModelDiagramEdgePointDto(x = point.x, y = point.y)
                        },
                    )
                },
            )
    }
}

data class DataModelDiagramInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String,
    val type: DataModelDiagramType = DataModelDiagramType.LOGICAL,
    val nodes: List<DataModelDiagramNodeDto> = emptyList(),
    val edges: List<DataModelDiagramEdgeDto> = emptyList(),
)
