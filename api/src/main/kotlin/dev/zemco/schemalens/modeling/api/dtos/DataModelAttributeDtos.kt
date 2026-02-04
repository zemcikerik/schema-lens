package dev.zemco.schemalens.modeling.api.dtos

data class DataModelAttributeInputDto(
    @field:NotBlank
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean,
    val isNullable: Boolean,
    val position: Short,
)

data class DataModelAttributeDto(
    val attributeId: Long? = null,
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean = false,
    val isNullable: Boolean = true,
    val position: Int
)
