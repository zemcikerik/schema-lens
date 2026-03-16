package dev.zemco.schemalens.modeling.nodes

data class DataModelFieldInputDto(
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean,
    val isNullable: Boolean,
    val position: Short,
)

data class DataModelFieldDto(
    val fieldId: Long? = null,
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean = false,
    val isNullable: Boolean = true,
    val position: Short
)
