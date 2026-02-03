package dev.zemco.schemalens.modeling.api.dtos


data class DataModelEntityDto(
    val id: Long,
    val name: String
)

data class DataModelEntityInputDto(
    val name: String
)
