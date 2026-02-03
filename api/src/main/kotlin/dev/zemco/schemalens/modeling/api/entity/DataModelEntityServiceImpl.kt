package dev.zemco.schemalens.modeling.entity

import dev.zemco.schemalens.modeling.DataModelRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

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
        require(dto.name.isNotBlank()) { "Entity name cannot be blank" }

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

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
            id = saved.id!!,
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

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

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
            id = saved.id!!,
            name = saved.name
        )
    }

    @Transactional
    override fun deleteEntity(
        modelId: Long,
        entityId: Long,
        userId: Long
    ) {
        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

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
