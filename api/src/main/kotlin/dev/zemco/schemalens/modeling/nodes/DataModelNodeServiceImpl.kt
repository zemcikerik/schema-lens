package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelNodeServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
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

        return nodeRepository.save(node).mapToDto()
    }

    @Transactional
    override fun updateNode(
        model: DataModel,
        nodeId: Long,
        dto: DataModelNodeInputDto,
    ): DataModelNodeDto {
        val node = model.findNode(nodeId).apply {
            name = dto.name
            fields.clear()
        }

        node.fields.addAll(
            dto.fields.map { fieldInput -> fieldInput.toEntity(model, node) }
        )

        return nodeRepository.save(node).mapToDto()
    }

    @Transactional
    override fun deleteNode(
        model: DataModel,
        nodeId: Long,
    ) {
        val node = model.findNode(nodeId)
        nodeRepository.delete(node)
    }

    private fun DataModelNode.mapToDto(): DataModelNodeDto =
        DataModelNodeDto(
            nodeId = id!!,
            name = name,
            fields = fields
                .sortedBy { it.position }
                .map {
                    DataModelFieldDto(
                        fieldId = it.id,
                        name = it.name,
                        typeId = it.typeId,
                        isPrimaryKey = it.isPrimaryKey,
                        isNullable = it.isNullable,
                        position = it.position,
                    )
                },
        )

    private fun DataModelFieldInputDto.toEntity(model: DataModel, node: DataModelNode): DataModelField {
        val dataType = model.findDataType(typeId)

        if (isPrimaryKey && isNullable) {
            throw IllegalArgumentException("Primary key field cannot be nullable")
        }

        return DataModelField(
            nodeId = node.id!!,
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
