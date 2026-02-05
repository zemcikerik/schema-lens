package dev.zemco.schemalens.modeling.api.relationship

import dev.zemco.schemalens.modeling.api.dtos.DataModelDtos

interface DataModelRelationshipService {
    fun createRelationship(
        modelId: Long,
        dto: DataModelRelationshipInputDto,
        userId: Long
    ): DataModelRelationshipDto

    fun updateRelationship(
        modelId: Long,
        relationshipId: Long,
        dto: DataModelRelationshipInputDto,
        userId: Long
    ): DataModelRelationshipDto

    fun deleteRelationship(modelId: Long, relationshipId: Long, userId: Long)
}
