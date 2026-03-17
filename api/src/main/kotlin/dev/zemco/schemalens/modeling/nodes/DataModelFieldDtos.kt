package dev.zemco.schemalens.modeling.nodes

data class DataModelFieldInputDto(
    val fieldId: Long? = null,
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
) {
    companion object {
        fun from(field: DataModelField): DataModelFieldDto =
            DataModelFieldDto(
                fieldId = field.id,
                name = field.name,
                typeId = field.typeId,
                isPrimaryKey = field.isPrimaryKey,
                isNullable = field.isNullable,
                position = field.position,
            )
    }
}
