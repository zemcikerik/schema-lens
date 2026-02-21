package dev.zemco.schemalens.modeling.api.entity

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.modeling.DataModel
import dev.zemco.schemalens.modeling.logical.DataModelEntity
import dev.zemco.schemalens.modeling.api.model.DataModelRepository
import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityInputDto
import dev.zemco.schemalens.modeling.api.model.DataModelNotFoundException

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
        val model = findModel(userId, modelId)

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
        val entity = findEntity(userId, modelId, entityId)

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
        val entity = findEntity(userId, modelId, entityId)
        entityRepository.delete(entity)
    }

    fun findModel(userId: Long, modelId: Long): DataModel {
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

    fun findEntity(userId: Long, modelId: Long, entityId: Long): DataModelEntity {
        findModel(userId, modelId)

        val entity = entityRepository.findById(entityId)
            .orElseThrow { EntityNotFoundException(entityId) }

        if (entity.modelId != modelId) {
            throw EntityNotFoundException(entityId)
        }

        return entity
    }
}
