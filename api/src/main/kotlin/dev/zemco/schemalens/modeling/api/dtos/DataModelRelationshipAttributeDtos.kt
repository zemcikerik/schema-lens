package dev.zemco.schemalens.modeling.api.dtos

data class DataModelRelationshipAttributeDto(
    val referencedAttributeId: Long,
    val name: String,
    val position: Short
)
