package dev.zemco.schemalens.modeling.api.dtos

data class DataModelDataTypeInputDto(
    @field:NotBlank
    val name: String
)

data class DataModelDataTypeDto(
    val id: Long,
    val name: String
)
