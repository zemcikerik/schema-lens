package dev.zemco.schemalens.modeling.api.relationship

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.modeling.repository.DataModelRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelRelationshipServiceImpl(
    private val modelRepository: DataModelRepository,
    private val entityRepository: DataModelEntityRepository,
    private val relationshipRepository: DataModelRelationshipRepository,
) : DataModelRelationshipService {

    @Transactional
    fun createRelationship(
        modelId: Long,
        dto: DataModelRelationshipInputDto,
        userId: Long
    ): DataModelRelationshipDto {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val fromEntity = entityRepository.findByIdAndModelId(dto.fromEntityId, modelId)
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST)

        val toEntity = entityRepository.findByIdAndModelId(dto.toEntityId, modelId)
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST)

        val relationship = DataModelRelationship(
            modelId = modelId,
            model = fromEntity.model,
            fromEntityId = fromEntity.id!!,
            fromEntity = fromEntity,
            toEntityId = toEntity.id!!,
            toEntity = toEntity,
            type = dto.type,
            isMandatory = dto.isMandatory,
            isIdentifying = dto.isIdentifying,
        )

        relationship.attributes = dto.attributes.map { attr ->
            val referencedAttribute =
                attributeRepository.findById(attr.referencedAttributeId)
                    .orElseThrow {
                        ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Referenced attribute not found",
                        )
                    }

            DataModelRelationshipAttribute(
                id = DataModelRelationshipAttribute.Id(
                    relationshipId = 0, // filled by Hibernate
                    referencedAttributeId = referencedAttribute.id!!,
                ),
                relationship = relationship,
                referencedAttribute = referencedAttribute,
                name = attr.name,
                position = attr.position,
            )
        }.toMutableList()

        val saved = relationshipRepository.save(relationship)

        return DataModelRelationshipDto(
            id = saved.id!!,
            fromEntityId = saved.fromEntityId,
            toEntityId = saved.toEntityId,
            type = saved.type,
            isMandatory = saved.isMandatory,
            isIdentifying = saved.isIdentifying,
            attributes = saved.attributes
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

    @Transactional
    fun updateRelationship(
        modelId: Long,
        relationshipId: Long,
        dto: DataModelRelationshipInputDto,
        userId: Long
    ): DataModelRelationshipDto {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val relationship = relationshipRepository.findByIdAndModelId(relationshipId, modelId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

        relationship.type = dto.type
        relationship.isMandatory = dto.isMandatory
        relationship.isIdentifying = dto.isIdentifying

        relationship.attributes.clear()

        dto.attributes.forEach { attr ->
            val referencedAttribute =
                attributeRepository.findById(attr.referencedAttributeId)
                    .orElseThrow {
                        ResponseStatusException(HttpStatus.BAD_REQUEST)
                    }

            relationship.attributes.add(
                DataModelRelationshipAttribute(
                    id = DataModelRelationshipAttribute.Id(
                        relationshipId = relationship.id!!,
                        referencedAttributeId = referencedAttribute.id!!,
                    ),
                    relationship = relationship,
                    referencedAttribute = referencedAttribute,
                    name = attr.name,
                    position = attr.position,
                )
            )
        }

        return DataModelRelationshipDto(
            id = relationship.id!!,
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

    @Transactional
    fun deleteRelationship(modelId: Long, relationshipId: Long, userId: Long) {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val relationship = relationshipRepository.findByIdAndModelId(relationshipId, modelId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

        relationshipRepository.delete(relationship)
    }
}
