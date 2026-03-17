package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.modeling.edges.DataModelEdge
import dev.zemco.schemalens.modeling.edges.DataModelEdgeDto
import dev.zemco.schemalens.modeling.edges.DataModelEdgeRepository
import dev.zemco.schemalens.modeling.nodes.DataModelNode
import org.springframework.stereotype.Service

@Service
class DataModelEdgeCascadeMutationServiceImpl(
    private val edgeRepository: DataModelEdgeRepository,
    private val cascadeService: DataModelCascadeService,
) : DataModelEdgeCascadeMutationService {

    override fun syncReferencedFieldsFromPrimaryKey(model: DataModel, edge: DataModelEdge) =
        cascadeService.syncReferencedFieldsFromPrimaryKey(model, edge)

    override fun collectCascadeEdgesAndSync(model: DataModel, fromNode: DataModelNode): List<DataModelEdge> =
        collectCascadeEdgesAndSync(model, listOf(fromNode))

    override fun collectCascadeEdgesAndSync(model: DataModel, fromNodes: Collection<DataModelNode>): List<DataModelEdge> =
        cascadeService.edgesInCascadeScope(fromNodes).also { scopedEdges ->
            scopedEdges.forEach { cascadeService.syncReferencedFieldsFromPrimaryKey(model, it) }
        }

    override fun persistAndMapEdges(edges: List<DataModelEdge>): List<DataModelEdgeDto> {
        if (edges.isEmpty()) {
            return emptyList()
        }

        val persistedById = edgeRepository.saveAll(edges).associateBy { it.id!! }

        return edges
            .asSequence()
            .map { it.id!! }
            .map { persistedById[it]!! }
            .map { DataModelEdgeDto.from(it) }
            .toList()
    }
}
