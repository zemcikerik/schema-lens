package dev.zemco.schemalens.modeling.api.dtos

data class DataModelRelationshipDto(
    val relationshipId: Long? = null,
    val fromEntityId: Long,
    val toEntityId: Long,
    val type: String, // "1:1" or "1:N"
    val isMandatory: Boolean = false,
    val isIdentifying: Boolean = false,
    val attributes: List<DataModelAttributeDto> = emptyList()
)
