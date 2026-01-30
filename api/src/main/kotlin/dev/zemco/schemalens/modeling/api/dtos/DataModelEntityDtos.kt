package dev.zemco.schemalens.modeling.api.dtos

data class DataModelEntityDto(
    val entityId: Long? = null,
    val name: String,
    val attributes: List<DataModelAttributeDto> = emptyList()
)
