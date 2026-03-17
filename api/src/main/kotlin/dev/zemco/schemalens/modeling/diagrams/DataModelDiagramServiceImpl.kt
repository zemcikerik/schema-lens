package dev.zemco.schemalens.modeling.diagrams

import dev.zemco.schemalens.ResourceNotFoundException
import dev.zemco.schemalens.modeling.models.DataModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDiagramServiceImpl(
    private val diagramRepository: DataModelDiagramRepository,
) : DataModelDiagramService {

    @Transactional(readOnly = true)
    override fun getAllDiagrams(model: DataModel): List<DataModelDiagramSimpleDto> =
        model.diagrams
            .map { DataModelDiagramSimpleDto.from(it) }
            .sortedBy { it.name }

    @Transactional(readOnly = true)
    override fun getDiagram(model: DataModel, diagramId: Long): DataModelDiagramDto =
        DataModelDiagramDto.from(findDiagram(model, diagramId))

    @Transactional
    override fun createDiagram(model: DataModel, dto: DataModelDiagramInputDto): DataModelDiagramDto {
        val diagram = DataModelDiagram(
            modelId = model.id!!,
            model = model,
            name = dto.name,
            type = dto.type,
        )

        syncNodes(diagram, model, dto)
        syncEdges(diagram, model, dto)

        return DataModelDiagramDto.from(diagramRepository.save(diagram))
    }

    @Transactional
    override fun updateDiagram(model: DataModel, diagramId: Long, dto: DataModelDiagramInputDto): DataModelDiagramDto {
        val diagram = findDiagram(model, diagramId).apply {
            name = dto.name
            type = dto.type
        }

        syncNodes(diagram, model, dto)
        syncEdges(diagram, model, dto)

        return DataModelDiagramDto.from(diagramRepository.save(diagram))
    }

    @Transactional
    override fun deleteDiagram(model: DataModel, diagramId: Long) {
        val diagram = findDiagram(model, diagramId)
        diagramRepository.delete(diagram)
    }

    private fun findDiagram(model: DataModel, diagramId: Long): DataModelDiagram =
        diagramRepository.findByIdAndModelId(diagramId, model.id!!)
            ?: throw ResourceNotFoundException.withId("Diagram", diagramId)

    private fun syncNodes(diagram: DataModelDiagram, model: DataModel, dto: DataModelDiagramInputDto) {
        diagram.nodes.clear()
        diagram.nodes.addAll(dto.nodes.map {
            val node = model.findNode(it.nodeId)

            DataModelDiagramNode(
                id = DataModelDiagramNode.Id(diagramId = diagram.id ?: 0L, nodeId = node.id!!),
                diagram = diagram,
                node = node,
                x = it.x,
                y = it.y,
                width = it.width,
                height = it.height,
            )
        })
    }

    private fun syncEdges(diagram: DataModelDiagram, model: DataModel, dto: DataModelDiagramInputDto) {
        diagram.edges.clear()
        diagram.edges.addAll(dto.edges.map {
            val edge = model.findEdge(it.edgeId)

            DataModelDiagramEdge(
                id = DataModelDiagramEdge.Id(diagramId = diagram.id ?: 0L, edgeId = edge.id!!),
                diagram = diagram,
                edge = edge,
                points = it.points.map { point -> DataModelDiagramEdge.Point(point.x, point.y) },
            )
        })
    }
}
