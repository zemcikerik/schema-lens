package dev.zemco.schemalens.modeling.api.attribute

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.modeling.DataModel
import dev.zemco.schemalens.modeling.logical.DataModelAttribute
import dev.zemco.schemalens.modeling.api.model.DataModelRepository
import dev.zemco.schemalens.modeling.api.entity.DataModelEntityRepository
import dev.zemco.schemalens.modeling.api.datatype.DataModelDataTypeRepository
import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeInputDto
import dev.zemco.schemalens.modeling.api.entity.EntityNotFoundException
import dev.zemco.schemalens.modeling.api.model.DataModelNotFoundException

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelAttributeServiceImpl(
    private val modelRepository: DataModelRepository,
    private val entityRepository: DataModelEntityRepository,
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val attributeRepository: DataModelAttributeRepository,
) : DataModelAttributeService {

    @Transactional
    override fun createAttribute(
        modelId: Long,
        entityId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ): DataModelAttributeDto {
        findDataModel(userId, modelId)

        val entity = entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw EntityNotFoundException(entityId)

        val dataType = dataTypeRepository.findByIdAndModelId(request.typeId, modelId)
            ?: throw IllegalArgumentException("Data type does not belong to model")

        if (request.isPrimaryKey && request.isNullable) {
            throw IllegalArgumentException("Primary key attribute cannot be nullable")
        }

        val attribute = DataModelAttribute(
            entityId = entity.id!!,
            entity = entity,
            name = request.name,
            typeId = request.typeId,
            type = dataType,
            isPrimaryKey = request.isPrimaryKey,
            isNullable = request.isNullable,
            position = request.position,
        )

        val saved = attributeRepository.save(attribute)

        return DataModelAttributeDto(
            attributeId = saved.id,
            name = saved.name,
            typeId = saved.typeId,
            isPrimaryKey = saved.isPrimaryKey,
            isNullable = saved.isNullable,
            position = saved.position,
        )
    }


    @Transactional
    override fun updateAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ): DataModelAttributeDto {
        findDataModel(userId, modelId)

        entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw EntityNotFoundException(entityId)

        val attribute = attributeRepository.findByIdAndEntityId(attributeId, entityId)
            ?: throw AttributeNotFoundException(attributeId)

        val dataType = dataTypeRepository.findByIdAndModelId(request.typeId, modelId)
            ?: throw IllegalArgumentException("Data type does not belong to model")

        if (request.isPrimaryKey && request.isNullable) {
            throw IllegalArgumentException("Primary key attribute cannot be nullable")
        }

        attribute.name = request.name
        attribute.typeId = request.typeId
        attribute.type = dataType
        attribute.isPrimaryKey = request.isPrimaryKey
        attribute.isNullable = request.isNullable
        attribute.position = request.position

        val saved = attributeRepository.save(attribute)

        return DataModelAttributeDto(
            attributeId = saved.id,
            name = saved.name,
            typeId = saved.typeId,
            isPrimaryKey = saved.isPrimaryKey,
            isNullable = saved.isNullable,
            position = saved.position,
        )
    }

    @Transactional
    override fun deleteAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        userId: Long
    ) {
        findDataModel(userId, modelId)

        entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw EntityNotFoundException(entityId)

        val attribute = attributeRepository.findByIdAndEntityId(attributeId, entityId)
            ?: throw AttributeNotFoundException(attributeId)


        attributeRepository.delete(attribute)
    }

    fun findDataModel(userId: Long, modelId: Long): DataModel {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw DataModelNotFoundException(modelId)
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw ResourceAccessDeniedException()
        }

        return model
    }
}
