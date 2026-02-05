package dev.zemco.schemalens.modeling.api.model

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.modeling.repository.DataModelRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelServiceImpl(
    private val repository: DataModelRepository,
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val entityRepository: DataModelEntityRepository,
    private val attributeRepository: DataModelAttributeRepository,
    private val relationshipRepository: DataModelRelationshipRepository,
    private val relationshipAttributeRepository: DataModelRelationshipAttributeRepository
) : DataModelService {

    override fun getAllModels(userId: Long): List<DataModelDto> =
        repository.findAllByOwnerId(userId).map { DataModelDto(it.modelId, it.name) }

    @Transactional
    override fun createModel(dto: DataModelInputDto, userId: Long): DataModelDto {
        require(dto.name.isNotBlank()) { "Model name cannot be blank" }

        val entity = DataModel(name = dto.name, ownerId = ownerId)
        val saved = repository.save(entity)
        return DataModelDto(id = saved.modelId, name = saved.name)
    }

    @Transactional
    fun updateModel(modelId: Long, dto: DataModelInputDto, ownerId: Long): DataModelDto {
        require(dto.name.isNotBlank()) { "Model name cannot be blank" }

        val model = repository.findById(modelId)
            .orElseThrow { NotFoundException("DataModel with id $modelId not found") }

        if (model.ownerId != ownerId) {
            throw AccessDeniedException("You do not have access to this model")
        }

        model.name = dto.name
        val saved = repository.save(model)  // ID stays the same, just updates the name
        return DataModelDto(id = saved.modelId, name = saved.name)
    }

    @Transactional
    fun deleteModel(modelId: Long, ownerId: Long) {
        val model = repository.findById(modelId)
            .orElseThrow { NotFoundException("DataModel with id $modelId not found") }

        if (model.ownerId != ownerId) {
            throw AccessDeniedException("You do not have access to this model")
        }

        repository.delete(model)
    }

    @Transactional(readOnly = true)
    fun getLogicalModel(modelId: Long, userId: Long): DataModelLogicalDto {
        val model = modelRepository.findById(modelId)
            .orElseThrow { NotFoundException("DataModel $modelId not found") }

        if (model.ownerId != userId) {
            throw AccessDeniedException("You do not have access to this model")
        }

        val dataTypes = dataTypeRepository.findAllByModelId(modelId)
            .map { DataModelDataTypeDto(it.typeId, it.name) }

        val entities = entityRepository.findAllByModelId(modelId)
            .map { entity ->
                val attributes = attributeRepository.findAllByEntityId(entity.entityId)
                    .map { attr ->
                        DataModelAttributeDto(
                            attributeId = attr.attributeId,
                            name = attr.name,
                            typeId = attr.typeId,
                            isPrimaryKey = attr.isPrimaryKey != 0,
                            isNullable = attr.isNullable != 0,
                            position = attr.position
                        )
                    }
                DataModelEntityLogicalDto(
                    entityId = entity.entityId,
                    name = entity.name,
                    attributes = attributes
                )
            }

        val relationships = relationshipRepository.findAllByModelId(modelId)
            .map { rel ->
                val relAttrs = relationshipAttributeRepository.findAllByRelationshipId(rel.relationshipId)
                    .map { ra ->
                        DataModelRelationshipAttributeDto(
                            referencedAttributeId = ra.referencedAttributeId,
                            name = ra.name,
                            position = ra.position
                        )
                    }
                DataModelRelationshipDto(
                    relationshipId = rel.relationshipId,
                    fromEntityId = rel.fromEntityId,
                    toEntityId = rel.toEntityId,
                    type = if (rel.type == "1") "1:1" else "1:N",
                    isMandatory = rel.isMandatory != 0,
                    isIdentifying = rel.isIdentifying != 0,
                    attributes = relAttrs
                )
            }

        return DataModelLogicalDto(
            dataTypes = dataTypes,
            entities = entities,
            relationships = relationships
        )
    }
}
