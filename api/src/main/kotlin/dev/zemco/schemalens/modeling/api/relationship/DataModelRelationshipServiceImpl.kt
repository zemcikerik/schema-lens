package dev.zemco.schemalens.modeling.api.relationship

import dev.zemco.schemalens.modeling.logical.DataModelRelationship
import dev.zemco.schemalens.modeling.logical.DataModelRelationshipAttribute
import dev.zemco.schemalens.modeling.api.dtos.DataModelRelationshipDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelRelationshipInputDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelRelationshipAttributeDto
import dev.zemco.schemalens.modeling.api.model.DataModelRepository
import dev.zemco.schemalens.modeling.api.entity.DataModelEntityRepository
import dev.zemco.schemalens.modeling.api.attribute.DataModelAttributeRepository

import org.springframework.http.HttpStatus
import jakarta.persistence.EntityNotFoundException
import java.lang.IllegalAccessException
import org.springframework.web.server.ResponseStatusException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelRelationshipServiceImpl(
    private val modelRepository: DataModelRepository,
    private val entityRepository: DataModelEntityRepository,
    private val relationshipRepository: DataModelRelationshipRepository,
    private val attributeRepository: DataModelAttributeRepository
) : DataModelRelationshipService {

    @Transactional
    override fun createRelationship(
        modelId: Long,
        dto: DataModelRelationshipInputDto,
        userId: Long
    ): DataModelRelationshipDto {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

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
            // TODO: N+1 query problem
            val referencedAttributeOptional = attributeRepository.findById(attr.referencedAttributeId)

            if (referencedAttributeOptional.isEmpty) {
                throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Referenced attribute with ID ${attr.referencedAttributeId} not found"
                )
            }

            val referencedAttribute = referencedAttributeOptional.get()

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
            relationshipId = saved.id!!,
            modelId = saved.modelId,
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
    override fun updateRelationship(
        modelId: Long,
        relationshipId: Long,
        dto: DataModelRelationshipInputDto,
        userId: Long
    ): DataModelRelationshipDto {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

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
            // TODO: N+1 query problem
            val referencedAttributeOptional = attributeRepository.findById(attr.referencedAttributeId)

            if (referencedAttributeOptional.isEmpty) {
                throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Referenced attribute with ID ${attr.referencedAttributeId} not found"
                )
            }

            val referencedAttribute = referencedAttributeOptional.get()

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

        // TODO: does this do anything?

        return DataModelRelationshipDto(
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

    @Transactional
    override fun deleteRelationship(modelId: Long, relationshipId: Long, userId: Long) {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw EntityNotFoundException("Model not found")
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val relationship = relationshipRepository.findByIdAndModelId(relationshipId, modelId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

        relationshipRepository.delete(relationship)
    }
}
