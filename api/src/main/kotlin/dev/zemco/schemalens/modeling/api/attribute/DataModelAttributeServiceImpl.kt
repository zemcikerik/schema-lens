package dev.zemco.schemalens.modeling.api.attribute

import dev.zemco.schemalens.modeling.logical.DataModelAttribute
import dev.zemco.schemalens.modeling.api.model.DataModelRepository
import dev.zemco.schemalens.modeling.api.entity.DataModelEntityRepository
import dev.zemco.schemalens.modeling.api.datatype.DataModelDataTypeRepository
import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeInputDto

import org.springframework.http.HttpStatus
import jakarta.persistence.EntityNotFoundException
import java.lang.IllegalAccessException
import org.springframework.web.server.ResponseStatusException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

// TODO: code duplication

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
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val entity = entityRepository.findByIdAndModelId(entityId, modelId)
            ?: throw ResponseStatusException( // TODO: don't use http statuses in service layer
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
    ) {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied") // TODO: ResourceAccessDeniedException
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
        attribute.typeId = request.typeId
        attribute.type = dataType
        attribute.isPrimaryKey = request.isPrimaryKey
        attribute.isNullable = request.isNullable
        attribute.position = request.position

        // TODO: does this do anything?
        // TODO: no return?
    }

    @Transactional
    override fun deleteAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        userId: Long
    ) {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

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
