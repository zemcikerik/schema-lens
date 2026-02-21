package dev.zemco.schemalens.modeling.api.dtos

data class DataModelEntityDto(
    val entityId: Long,
    val name: String
)

data class DataModelEntityInputDto(
    val name: String
)

data class DataModelEntityLogicalDto(
    val entityId: Long,
    val name: String,
    val attributes: List<DataModelAttributeDto>
)
