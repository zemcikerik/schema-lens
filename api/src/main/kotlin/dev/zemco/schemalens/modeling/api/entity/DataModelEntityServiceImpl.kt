package dev.zemco.schemalens.modeling.api.entity

import dev.zemco.schemalens.modeling.logical.DataModelEntity
import dev.zemco.schemalens.modeling.api.model.DataModelRepository
import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityInputDto

import jakarta.persistence.EntityNotFoundException
import java.lang.IllegalAccessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

// TODO: duplicated code fragments
@Service
class DataModelEntityServiceImpl(
    private val entityRepository: DataModelEntityRepository,
    private val modelRepository: DataModelRepository
) : DataModelEntityService {

    @Transactional
    override fun createEntity(
        modelId: Long,
        dto: DataModelEntityInputDto,
        userId: Long
    ): DataModelEntityDto {
        require(dto.name.isNotBlank()) { "Entity name cannot be blank" } // TODO: use validation annotations in dto

        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val entity = DataModelEntity(
            modelId = modelId,
            model = model,
            name = dto.name
        )

        val saved = entityRepository.save(entity)

        return DataModelEntityDto(
            entityId = saved.id!!,
            name = saved.name
        )
    }


    @Transactional
    override fun updateEntity(
        modelId: Long,
        entityId: Long,
        dto: DataModelEntityInputDto,
        userId: Long
    ): DataModelEntityDto {
        require(dto.name.isNotBlank()) { "Entity name cannot be blank" }

        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val entity = entityRepository.findById(entityId)
            .orElseThrow { EntityNotFoundException("Entity not found") }

        if (entity.modelId != modelId) {
            throw EntityNotFoundException("Entity does not belong to model")
        }

        entity.name = dto.name

        val saved = entityRepository.save(entity)

        return DataModelEntityDto(
            entityId = saved.id!!,
            name = saved.name
        )
    }

    @Transactional
    override fun deleteEntity(
        modelId: Long,
        entityId: Long,
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

        val entity = entityRepository.findById(entityId)
            .orElseThrow { EntityNotFoundException("Entity not found") }

        if (entity.modelId != modelId) {
            throw EntityNotFoundException("Entity does not belong to model")
        }

        entityRepository.delete(entity)
    }
}
