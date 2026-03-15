package dev.zemco.schemalens.modeling.nodes

import com.fasterxml.jackson.annotation.JsonProperty

data class DataModelFieldInputDto(
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean,
    val isNullable: Boolean,
    val position: Short,
)

data class DataModelFieldDto(
    @field:JsonProperty("attributeId")
    val fieldId: Long? = null,
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean = false,
    val isNullable: Boolean = true,
    val position: Short
)
