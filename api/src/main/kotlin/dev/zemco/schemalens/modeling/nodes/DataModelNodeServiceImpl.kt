package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.edges.DataModelEdgeWriteService
import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelEdgeCascadeMutationService
import dev.zemco.schemalens.modeling.models.DataModelModificationDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelNodeServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
    private val edgeCascadeMutationService: DataModelEdgeCascadeMutationService,
    private val edgeWriteService: DataModelEdgeWriteService,
) : DataModelNodeService {

    @Transactional
    override fun createNode(
        model: DataModel,
        dto: DataModelNodeInputDto,
    ): DataModelNodeDto {
        val node = nodeRepository.save(
            DataModelNode(
                modelId = model.id!!,
                model = model,
                name = dto.name,
            )
        )

        node.fields = dto.fields.asSequence()
            .map { fieldInput -> fieldInput.toEntity(model, node) }
            .toMutableSet()

        return DataModelNodeDto.from(nodeRepository.save(node))
    }

    @Transactional
    override fun updateNode(model: DataModel, nodeId: Long, dto: DataModelNodeInputDto): DataModelModificationDto {
        val node = model.findNode(nodeId).apply {
            name = dto.name
        }
        val primaryKeyChanged = hasPrimaryKeyChanged(node.fields, dto.fields)

        val (toUpdate, toInsert) = dto.fields.partition { it.fieldId != null }
        val updateById = toUpdate.associateBy { it.fieldId!! }

        node.fields.forEach { existingField ->
            val input = updateById[existingField.id]

            if (input != null) {
                existingField.apply {
                    name = input.name
                    typeId = input.typeId
                    type = model.findDataType(input.typeId)
                    isPrimaryKey = input.isPrimaryKey
                    isNullable = input.isNullable
                    position = input.position
                }
            }
        }

        node.fields.removeAll { it.id !in updateById }

        node.fields.addAll(
            toInsert.map { fieldInput -> fieldInput.toEntity(model, node) }
        )

        val savedNode = nodeRepository.save(node)
        val updatedNodes = listOf(DataModelNodeDto.from(savedNode))

        if (!primaryKeyChanged) {
            return DataModelModificationDto(updatedNodes = updatedNodes)
        }

        return DataModelModificationDto(
            updatedNodes = updatedNodes,
            updatedEdges = edgeCascadeMutationService
                .collectCascadeEdgesAndSync(model, savedNode)
                .let { edgeWriteService.persistAndMapEdges(it) },
        )
    }

    @Transactional
    override fun deleteNode(model: DataModel, nodeId: Long): DataModelModificationDto {
        val node = model.findNode(nodeId)

        val nodeEdges = model.edges
            .asSequence()
            .filter { it.fromNodeId == nodeId || it.toNodeId == nodeId }
            .toSet()

        val cascadeStartNodes = nodeEdges
            .asSequence()
            .filter { it.fromNodeId == nodeId && it.isIdentifying }
            .map { it.toNodeId }
            .distinct()
            .map { model.findNode(it) }
            .toList()

        val deletedEdgeIds = nodeEdges.map { it.id!! }

        model.edges.removeAll(nodeEdges)
        model.nodes.remove(node)
        nodeRepository.delete(node)

        val updatedEdges = edgeCascadeMutationService
            .collectCascadeEdgesAndSync(model, cascadeStartNodes)

        return DataModelModificationDto(
            updatedEdges = edgeWriteService.persistAndMapEdges(updatedEdges),
            deletedNodeIds = listOf(nodeId),
            deletedEdgeIds = deletedEdgeIds,
        )
    }

    private fun hasPrimaryKeyChanged(
        existingFields: Collection<DataModelField>,
        requestedFields: Collection<DataModelFieldInputDto>,
    ): Boolean {
        val existingById = existingFields.associateBy { field -> field.id!! }

        val requestedById = requestedFields
            .asSequence()
            .filter { it.fieldId != null }
            .associateBy { it.fieldId!! }

        if (existingFields.any { it.isPrimaryKey && it.id !in requestedById }) {
            return true
        }

        if (requestedFields.any { it.fieldId == null && it.isPrimaryKey }) {
            return true
        }

        return existingById.any { (fieldId, existingField) ->
            val requestedField = requestedById[fieldId] ?: return@any false

            val primaryKeyMembershipChanged = requestedField.isPrimaryKey != existingField.isPrimaryKey
            val primaryKeyTypeChanged = existingField.isPrimaryKey && requestedField.typeId != existingField.typeId

            primaryKeyMembershipChanged || primaryKeyTypeChanged
        }
    }

    private fun DataModelFieldInputDto.toEntity(model: DataModel, node: DataModelNode): DataModelField {
        val dataType = model.findDataType(typeId)

        if (isPrimaryKey && isNullable) {
            throw IllegalArgumentException("Primary key field cannot be nullable")
        }

        return DataModelField(
            nodeId = node.id ?: 0,
            node = node,
            name = name,
            typeId = dataType.id!!,
            type = dataType,
            isPrimaryKey = isPrimaryKey,
            isNullable = isNullable,
            position = position,
        )
    }
}
