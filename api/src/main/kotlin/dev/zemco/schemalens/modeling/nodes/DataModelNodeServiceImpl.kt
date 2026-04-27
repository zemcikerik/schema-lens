package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.edges.DataModelEdgeWriteService
import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelCascadeService
import dev.zemco.schemalens.modeling.models.DataModelEdgeCascadeMutationService
import dev.zemco.schemalens.modeling.models.DataModelModificationDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelNodeServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
    private val cascadeService: DataModelCascadeService,
    private val edgeCascadeMutationService: DataModelEdgeCascadeMutationService,
    private val edgeWriteService: DataModelEdgeWriteService,
) : DataModelNodeService {

    private enum class PrimaryKeyChange { NONE, TYPE_ONLY, STRUCTURAL }

    @Transactional
    override fun createNode(
        model: DataModel,
        dto: DataModelNodeInputDto,
    ): DataModelNodeDto {
        val normalizedName = dto.name.trim()

        if (model.findNodeByNameOrNull(normalizedName) != null) {
            throw NodeExistsException(normalizedName)
        }

        validateFieldNameUniqueness(dto.fields.map { it.name })

        val node = nodeRepository.save(
            DataModelNode(
                modelId = model.id!!,
                model = model,
                name = normalizedName,
            )
        )

        node.fields = dto.fields.asSequence()
            .map { fieldInput -> fieldInput.toEntity(model, node) }
            .toMutableSet()

        return DataModelNodeDto.from(nodeRepository.save(node))
    }

    @Transactional
    override fun updateNode(model: DataModel, nodeId: Long, dto: DataModelNodeInputDto): DataModelModificationDto {
        val normalizedName = dto.name.trim()
        val existingNode = model.findNodeByNameOrNull(normalizedName)

        if (existingNode != null && existingNode.id != nodeId) {
            throw NodeExistsException(normalizedName)
        }

        val node = model.findNode(nodeId)
        val edgeFieldNames = model.edges
            .filter { it.toNodeId == nodeId }
            .flatMap { it.fields }
            .map { it.name }

        validateFieldNameUniqueness(dto.fields.map { it.name } + edgeFieldNames)

        node.name = normalizedName
        val primaryKeyChange = detectPrimaryKeyChange(node.fields, dto.fields)

        val (toUpdate, toInsert) = dto.fields.partition { it.fieldId != null }
        val updateById = toUpdate.associateBy { it.fieldId!! }

        node.fields.forEach { existingField ->
            val input = updateById[existingField.id]

            if (input != null) {
                existingField.apply {
                    name = input.name.trim()
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

        return when (primaryKeyChange) {
            PrimaryKeyChange.NONE -> DataModelModificationDto(updatedNodes = updatedNodes)

            PrimaryKeyChange.TYPE_ONLY -> {
                val visuallyStaleNodeIds = cascadeService.edgesInCascadeScope(savedNode)
                    .map { it.toNodeId }
                    .filter { it != savedNode.id }
                    .distinct()

                DataModelModificationDto(
                    updatedNodes = updatedNodes,
                    visuallyStaleNodeIds = visuallyStaleNodeIds,
                )
            }

            PrimaryKeyChange.STRUCTURAL -> {
                val updatedEdges = edgeCascadeMutationService
                    .collectCascadeEdgesAndSync(model, savedNode)
                    .let { edgeWriteService.persistAndMapEdges(it) }

                val visuallyStaleNodeIds = updatedEdges
                    .map { it.toNodeId }
                    .filter { it != savedNode.id }
                    .distinct()

                DataModelModificationDto(
                    updatedNodes = updatedNodes,
                    updatedEdges = updatedEdges,
                    visuallyStaleNodeIds = visuallyStaleNodeIds,
                )
            }
        }
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

        val directlyAffectedNodeIds = nodeEdges
            .asSequence()
            .filter { it.fromNodeId == nodeId }
            .map { it.toNodeId }
            .toList()

        model.edges.removeAll(nodeEdges)
        model.nodes.remove(node)
        nodeRepository.delete(node)

        val cascadeEdges = edgeCascadeMutationService.collectCascadeEdgesAndSync(model, cascadeStartNodes)
        val updatedEdges = edgeWriteService.persistAndMapEdges(cascadeEdges)

        val visuallyStaleNodeIds = (directlyAffectedNodeIds + updatedEdges.map { it.toNodeId })
            .filter { it != nodeId }
            .distinct()

        return DataModelModificationDto(
            updatedEdges = updatedEdges,
            deletedNodeIds = listOf(nodeId),
            deletedEdgeIds = deletedEdgeIds,
            visuallyStaleNodeIds = visuallyStaleNodeIds,
        )
    }

    private fun detectPrimaryKeyChange(
        existingFields: Collection<DataModelField>,
        requestedFields: Collection<DataModelFieldInputDto>,
    ): PrimaryKeyChange {
        val existingById = existingFields.associateBy { field -> field.id!! }

        val requestedById = requestedFields
            .asSequence()
            .filter { it.fieldId != null }
            .associateBy { it.fieldId!! }

        if (existingFields.any { it.isPrimaryKey && it.id !in requestedById }) {
            return PrimaryKeyChange.STRUCTURAL
        }

        if (requestedFields.any { it.fieldId == null && it.isPrimaryKey }) {
            return PrimaryKeyChange.STRUCTURAL
        }

        var typeOnlyChange = false

        for ((fieldId, existingField) in existingById) {
            val requestedField = requestedById[fieldId] ?: continue

            if (requestedField.isPrimaryKey != existingField.isPrimaryKey) {
                return PrimaryKeyChange.STRUCTURAL
            }

            if (existingField.isPrimaryKey && requestedField.typeId != existingField.typeId) {
                typeOnlyChange = true
            }
        }

        return if (typeOnlyChange) PrimaryKeyChange.TYPE_ONLY else PrimaryKeyChange.NONE
    }

    private fun validateFieldNameUniqueness(fieldNames: List<String>) {
        val seen = mutableSetOf<String>()

        for (name in fieldNames) {
            val normalized = name.trim().uppercase()
            if (!seen.add(normalized)) {
                throw FieldNameNotUniqueException(name.trim())
            }
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
            name = name.trim(),
            typeId = dataType.id!!,
            type = dataType,
            isPrimaryKey = isPrimaryKey,
            isNullable = isNullable,
            position = position,
        )
    }
}
