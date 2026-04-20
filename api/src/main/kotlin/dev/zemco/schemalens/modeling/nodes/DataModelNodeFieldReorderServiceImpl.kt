package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.edges.DataModelEdge
import dev.zemco.schemalens.modeling.edges.DataModelEdgeField
import dev.zemco.schemalens.modeling.edges.DataModelEdgeWriteService
import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelModificationDto
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class DataModelNodeFieldReorderServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
    private val edgeWriteService: DataModelEdgeWriteService,
) : DataModelNodeFieldReorderService {

    @Transactional
    override fun reorderNodeFields(
        model: DataModel,
        nodeId: Long,
        dto: DataModelFieldReorderInputDto,
    ): DataModelModificationDto {
        val node = model.findNode(nodeId)
        val requestedById = dto.directFields.associateBy { it.fieldId }
        val nodeFieldIds = node.fields.mapNotNull { it.id }.toSet()

        if (requestedById.size != dto.directFields.size || requestedById.keys != nodeFieldIds) {
            throw DataModelNodeFieldReorderRequestInvalidException(nodeId)
        }

        val positionByFieldId = requestedById.mapValues { (_, field) -> field.position }
        val edgeRequestsByKey = dto.edgeFields.associateBy { DataModelEdgeField.Id(it.edgeId, it.referencedFieldId) }

        if (edgeRequestsByKey.size != dto.edgeFields.size) {
            throw DataModelNodeFieldReorderRequestInvalidException(nodeId)
        }

        val expectedEdgeFieldKeys = model.edges.asSequence()
            .filter { it.toNodeId == nodeId }
            .flatMap { edge -> edge.fields.asSequence().map { it.id } }
            .toSet()

        if (edgeRequestsByKey.keys != expectedEdgeFieldKeys) {
            throw DataModelNodeFieldReorderRequestInvalidException(nodeId)
        }

        node.fields.forEach { field ->
            field.position = positionByFieldId[field.id]!!
        }

        val affectedEdgesById = mutableMapOf<Long, DataModelEdge>()

        edgeRequestsByKey.forEach { (edgeFieldId, edgeFieldRequest) ->
            val edge = model.findEdge(edgeFieldId.edgeId)

            if (edge.toNodeId != nodeId) {
                throw DataModelNodeFieldReorderRequestInvalidException(nodeId)
            }

            val edgeField = edge.fields.firstOrNull {
                it.id == edgeFieldId
            } ?: throw DataModelNodeFieldReorderRequestInvalidException(nodeId)

            edgeField.position = edgeFieldRequest.position
            affectedEdgesById[edge.id!!] = edge
        }

        val savedNode = nodeRepository.save(node)

        return DataModelModificationDto(
            updatedNodes = listOf(DataModelNodeDto.from(savedNode)),
            updatedEdges = edgeWriteService.persistAndMapEdges(affectedEdgesById.values.toList()),
        )
    }
}
