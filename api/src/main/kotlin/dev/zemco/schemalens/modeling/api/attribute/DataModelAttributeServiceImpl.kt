package dev.zemco.schemalens.modeling.api.attribute

import dev.zemco.schemalens.modeling.DataModelRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelAttributeServiceImpl(
    private val entityRepository: DataModelEntityRepository,
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val attributeRepository: DataModelAttributeRepository,
) : DataModelAttributeService {

    @Transactional
    fun createAttribute(
        modelId: Long,
        entityId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ): DataModelAttribute {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val entity = entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Entity not found in model",
            )

        val dataType = dataTypeRepository.findByIdAndModelId(request.typeId, modelId)
            ?: throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data type does not belong to model",
            )

        if (request.isPrimaryKey && request.isNullable) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Primary key attribute cannot be nullable",
            )
        }

        val attribute = DataModelAttribute(
            entityId = entity.id!!,
            entity = entity,
            name = request.name,
            typeId = dataType.id!!,
            type = dataType,
            isPrimaryKey = request.isPrimaryKey,
            isNullable = request.isNullable,
            position = request.position,
        )

        return attributeRepository.save(attribute)
    }


    @Transactional
    fun updateAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ) {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val entity = entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Entity not found in model",
            )

        val attribute = attributeRepository.findByIdAndEntityId(attributeId, entityId)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Attribute not found in entity",
            )

        val dataType = dataTypeRepository.findByIdAndModelId(request.typeId, modelId)
            ?: throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data type does not belong to model",
            )

        if (request.isPrimaryKey && request.isNullable) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Primary key attribute cannot be nullable",
            )
        }

        attribute.name = request.name
        attribute.typeId = dataType.id!!
        attribute.type = dataType
        attribute.isPrimaryKey = request.isPrimaryKey
        attribute.isNullable = request.isNullable
        attribute.position = request.position
    }


    @Transactional
    fun deleteAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        userId: Long
    ) {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val entity = entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Entity not found in model",
            )

        val attribute = attributeRepository.findByIdAndEntityId(attributeId, entityId)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Attribute not found in entity",
            )

        attributeRepository.delete(attribute)
    }
}
