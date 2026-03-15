package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.ResourceNotFoundException
import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.types.DataModelDataTypeRepository

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelFieldServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val fieldRepository: DataModelFieldRepository,
) : DataModelFieldService {

    @Transactional
    override fun createField(
        model: DataModel,
        nodeId: Long,
        request: DataModelFieldInputDto,
    ): DataModelFieldDto {
        val modelId = model.id!!

        // TODO: maybe access directly from the model?
        val node = nodeRepository.findByIdAndModelId(nodeId, modelId)
            ?: throw ResourceNotFoundException.withId("Node", nodeId)

        val dataType = dataTypeRepository.findByIdAndModelId(request.typeId, modelId)
            ?: throw IllegalArgumentException("Data type does not belong to model")

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

        val saved = fieldRepository.save(attribute)

        return DataModelFieldDto(
            fieldId = saved.id,
            name = saved.name,
            typeId = saved.typeId,
            isPrimaryKey = saved.isPrimaryKey,
            isNullable = saved.isNullable,
            position = saved.position,
        )
    }


    @Transactional
    override fun updateField(
        model: DataModel,
        nodeId: Long,
        fieldId: Long,
        request: DataModelFieldInputDto,
    ): DataModelFieldDto {
        val modelId = model.id!!

        // TODO: maybe access directly from the model?
        nodeRepository.findByIdAndModelId(nodeId, modelId)
            ?: throw ResourceNotFoundException.withId("Node", nodeId)

        val attribute = fieldRepository.findByIdAndNodeId(fieldId, nodeId)
            ?: throw ResourceNotFoundException.withId("Field", fieldId)

        val dataType = dataTypeRepository.findByIdAndModelId(request.typeId, modelId)
            ?: throw IllegalArgumentException("Data type does not belong to model")

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

        val saved = fieldRepository.save(attribute)

        return DataModelFieldDto(
            fieldId = saved.id,
            name = saved.name,
            typeId = saved.typeId,
            isPrimaryKey = saved.isPrimaryKey,
            isNullable = saved.isNullable,
            position = saved.position,
        )
    }

    @Transactional
    override fun deleteField(
        model: DataModel,
        nodeId: Long,
        fieldId: Long,
    ) {
        val modelId = model.id!!

        // TODO: maybe access directly from the model?
        nodeRepository.findByIdAndModelId(nodeId, modelId)
            ?: throw ResourceNotFoundException.withId("Node", nodeId)

        val attribute = fieldRepository.findByIdAndNodeId(fieldId, nodeId)
            ?: throw ResourceNotFoundException.withId("Field", fieldId)

        fieldRepository.delete(attribute)
    }
}
