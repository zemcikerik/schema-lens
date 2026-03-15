package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelFieldServiceImpl(
    private val fieldRepository: DataModelFieldRepository,
) : DataModelFieldService {

    @Transactional
    override fun createField(
        model: DataModel,
        nodeId: Long,
        request: DataModelFieldInputDto,
    ): DataModelFieldDto {
        val node = model.findNode(nodeId)
        val dataType = model.findDataType(request.typeId)

        if (request.isPrimaryKey && request.isNullable) {
            throw IllegalArgumentException("Primary key attribute cannot be nullable")
        }

        val attribute = DataModelField(
            nodeId = node.id!!,
            node = node,
            name = request.name,
            typeId = request.typeId,
            type = dataType,
            isPrimaryKey = request.isPrimaryKey,
            isNullable = request.isNullable,
            position = request.position,
        )

        return fieldRepository.save(attribute).mapToDto()
    }

    @Transactional
    override fun updateField(
        model: DataModel,
        nodeId: Long,
        fieldId: Long,
        request: DataModelFieldInputDto,
    ): DataModelFieldDto {
        val attribute = model.findField(nodeId, fieldId)
        val dataType = model.findDataType(request.typeId)

        if (request.isPrimaryKey && request.isNullable) {
            throw IllegalArgumentException("Primary key attribute cannot be nullable")
        }

        attribute.apply {
            name = request.name
            typeId = request.typeId
            type = dataType
            isPrimaryKey = request.isPrimaryKey
            isNullable = request.isNullable
            position = request.position
        }

        return fieldRepository.save(attribute).mapToDto()
    }

    @Transactional
    override fun deleteField(
        model: DataModel,
        nodeId: Long,
        fieldId: Long,
    ) {
        val attribute = model.findField(nodeId, fieldId)
        fieldRepository.delete(attribute)
    }

    private fun DataModelField.mapToDto(): DataModelFieldDto =
        DataModelFieldDto(
            fieldId = id,
            name = name,
            typeId = typeId,
            isPrimaryKey = isPrimaryKey,
            isNullable = isNullable,
            position = position,
        )
}
