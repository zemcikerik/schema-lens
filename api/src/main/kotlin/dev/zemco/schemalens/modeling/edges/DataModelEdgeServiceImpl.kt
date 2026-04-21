package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelEdgeCascadeMutationService
import dev.zemco.schemalens.modeling.models.DataModelModificationDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelEdgeServiceImpl(
    private val edgeRepository: DataModelEdgeRepository,
    private val edgeCascadeMutationService: DataModelEdgeCascadeMutationService,
    private val edgeWriteService: DataModelEdgeWriteService,
) : DataModelEdgeService {

    @Transactional
    override fun createEdge(model: DataModel, dto: DataModelEdgeInputDto): DataModelModificationDto {
        val fromNode = model.findNode(dto.fromNodeId)
        val toNode = model.findNode(dto.toNodeId)

        val edge = DataModelEdge(
            modelId = model.id!!,
            model = model,
            fromNodeId = fromNode.id!!,
            fromNode = fromNode,
            toNodeId = toNode.id!!,
            toNode = toNode,
            type = dto.type,
            isMandatory = dto.isMandatory,
            isIdentifying = dto.isIdentifying,
        )

        val saved = edgeRepository.save(edge)

        return persistUpdatedEdges(
            model = model,
            edge = saved,
            syncEdgeFields = true,
            syncCascade = saved.isIdentifying,
        )
    }

    @Transactional
    override fun updateEdge(model: DataModel, edgeId: Long, dto: DataModelEdgeInputDto): DataModelModificationDto {
        val edge = model.findEdge(edgeId)
        val wasIdentifying = edge.isIdentifying

        val requestedFields = dto.fields.orEmpty()
        val existingFieldIds = edge.fields.map { it.id.referencedFieldId }.toSet()
        val requestedFieldIds = requestedFields.map { it.referencedFieldId }.toSet()

        if (existingFieldIds != requestedFieldIds) {
            throw DataModelEdgeReferencedFieldsImmutableException(edgeId)
        }

        edge.apply {
            type = dto.type
            isMandatory = dto.isMandatory
            isIdentifying = dto.isIdentifying
        }

        val existingFieldsByReferencedFieldId = edge.fields.associateBy { it.id.referencedFieldId }

        requestedFields.forEach { field ->
            val referencedField = existingFieldsByReferencedFieldId[field.referencedFieldId]!!
            referencedField.name = field.name
            referencedField.position = field.position
        }

        val saved = edgeRepository.save(edge)

        return persistUpdatedEdges(
            model = model,
            edge = saved,
            syncEdgeFields = false,
            syncCascade = wasIdentifying != saved.isIdentifying,
        )
    }

    @Transactional
    override fun deleteEdge(model: DataModel, edgeId: Long): DataModelModificationDto {
        val edge = model.findEdge(edgeId)
        val deletedEdgeId = edge.id!!
        val wasIdentifying = edge.isIdentifying
        val toNodeId = edge.toNodeId

        model.edges.removeIf { it.id == deletedEdgeId }
        edgeRepository.delete(edge)

        if (!wasIdentifying) {
            return DataModelModificationDto(
                deletedEdgeIds = listOf(deletedEdgeId),
                visuallyStaleNodeIds = listOf(toNodeId),
            )
        }

        val cascadeEdges = edgeCascadeMutationService.collectCascadeEdgesAndSync(model, edge.toNode)
        val updatedEdges = edgeWriteService.persistAndMapEdges(cascadeEdges)
        val visuallyStaleNodeIds = (listOf(toNodeId) + updatedEdges.map { it.toNodeId }).distinct()

        return DataModelModificationDto(
            updatedEdges = updatedEdges,
            deletedEdgeIds = listOf(deletedEdgeId),
            visuallyStaleNodeIds = visuallyStaleNodeIds,
        )
    }

    private fun persistUpdatedEdges(
        model: DataModel,
        edge: DataModelEdge,
        syncEdgeFields: Boolean,
        syncCascade: Boolean,
    ): DataModelModificationDto {
        if (syncEdgeFields) {
            edgeCascadeMutationService.syncReferencedFieldsFromPrimaryKey(model, edge)
        }

        if (!syncCascade) {
            val persistedEdge = if (syncEdgeFields) edgeRepository.save(edge) else edge
            return DataModelModificationDto(
                updatedEdges = listOf(DataModelEdgeDto.from(persistedEdge)),
                visuallyStaleNodeIds = listOf(edge.toNodeId),
            )
        }

        val cascadeEdges = edgeCascadeMutationService.collectCascadeEdgesAndSync(model, edge.toNode)

        val edgesToPersist = (sequenceOf(edge) + cascadeEdges.asSequence())
            .distinctBy { it.id }
            .toList()

        val updatedEdges = edgeWriteService.persistAndMapEdges(edgesToPersist)
        val visuallyStaleNodeIds = updatedEdges.map { it.toNodeId }.distinct()

        return DataModelModificationDto(
            updatedEdges = updatedEdges,
            visuallyStaleNodeIds = visuallyStaleNodeIds,
        )
    }
}
