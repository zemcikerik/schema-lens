package dev.zemco.schemalens.modeling.api.model

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.modeling.DataModel
import dev.zemco.schemalens.modeling.api.dtos.DataModelDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelInputDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelLogicalDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelDataTypeDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityLogicalDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelRelationshipDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelRelationshipAttributeDto

import dev.zemco.schemalens.modeling.api.datatype.DataModelDataTypeRepository
import dev.zemco.schemalens.modeling.api.entity.DataModelEntityRepository
import dev.zemco.schemalens.modeling.api.attribute.DataModelAttributeRepository
import dev.zemco.schemalens.modeling.api.relationship.DataModelRelationshipRepository

import jakarta.persistence.EntityNotFoundException
import java.lang.IllegalAccessException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelServiceImpl(
    private val repository: DataModelRepository,
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val entityRepository: DataModelEntityRepository,
    private val attributeRepository: DataModelAttributeRepository,
    private val relationshipRepository: DataModelRelationshipRepository
) : DataModelService {

    override fun getAllModels(userId: Long): List<DataModelDto> =
        repository.findAllByOwnerId(userId).map { DataModelDto(it.id, it.name) }

    @Transactional
    override fun createModel(dto: DataModelInputDto, user: User): DataModelDto {
        require(dto.name.isNotBlank()) { "Model name cannot be blank" }

        val entity = DataModel(name = dto.name, ownerId = user.id!!, owner = user)
        val saved = repository.save(entity)
        return DataModelDto(id = saved.id, name = saved.name)
    }

    @Transactional
    override fun updateModel(modelId: Long, dto: DataModelInputDto, ownerId: Long): DataModelDto {
        require(dto.name.isNotBlank()) { "Model name cannot be blank" }

        val optionalModel = repository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != ownerId) {
            throw IllegalAccessException("Access denied")
        }

        model.name = dto.name
        val saved = repository.save(model)  // ID stays the same, just updates the name
        return DataModelDto(id = saved.id, name = saved.name)
    }

    @Transactional
    override fun deleteModel(modelId: Long, ownerId: Long) {
        val optionalModel = repository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != ownerId) {
            throw IllegalAccessException("Access denied")
        }

        repository.delete(model)
    }

    @Transactional(readOnly = true)
    override fun getLogicalModel(modelId: Long, userId: Long): DataModelLogicalDto {
        val optionalModel = repository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val dataTypes = dataTypeRepository.findAllByModelId(modelId)
            .map { DataModelDataTypeDto(it.id!!, it.name) }

        val entities = entityRepository.findAllByModelId(modelId)
            .map { entity ->
                // TODO: fix N+1 query problem here by fetching attributes in batch and grouping by entity ID
                val attributes = attributeRepository.findAllByEntityId(entity.id!!)
                    .map { attr ->
                        DataModelAttributeDto(
                            attributeId = attr.id,
                            name = attr.name,
                            typeId = attr.typeId,
                            isPrimaryKey = attr.isPrimaryKey,
                            isNullable = attr.isNullable,
                            position = attr.position
                        )
                    }
                DataModelEntityLogicalDto(
                    entityId = entity.id!!,
                    name = entity.name,
                    attributes = attributes
                )
            }

        val relationships = relationshipRepository.findAllByModelId(modelId)
            .map { relationship ->
                DataModelRelationshipDto(
                    relationshipId = relationship.id!!,
                    modelId = relationship.modelId,
                    fromEntityId = relationship.fromEntityId,
                    toEntityId = relationship.toEntityId,
                    type = relationship.type,
                    isMandatory = relationship.isMandatory,
                    isIdentifying = relationship.isIdentifying,
                    attributes = relationship.attributes
                        .sortedBy { it.position }
                        .map {
                            DataModelRelationshipAttributeDto(
                                referencedAttributeId = it.id.referencedAttributeId,
                                name = it.name,
                                position = it.position,
                            )
                        },
                )
            }

        return DataModelLogicalDto(
            dataTypes = dataTypes,
            entities = entities,
            relationships = relationships
        )
    }
}
