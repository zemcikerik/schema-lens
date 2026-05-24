package dev.zemco.schemalens.modeling.nodes

import jakarta.validation.constraints.NotBlank

data class DataModelFieldTypeParameterInputDto(
    @field:NotBlank
    val name: String,
    val value: String? = null,
)

data class DataModelFieldTypeParameterDto(
    val name: String,
    val value: String? = null,
)

data class DataModelFieldInputDto(
    val fieldId: Long? = null,
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean,
    val isNullable: Boolean,
    val position: Short,
    val dataTypeParameters: List<DataModelFieldTypeParameterInputDto>? = null,
)

data class DataModelFieldDto(
    val fieldId: Long? = null,
    val name: String,
    val typeId: Long,
    val isPrimaryKey: Boolean = false,
    val isNullable: Boolean = true,
    val position: Short,
    val dataTypeParameters: List<DataModelFieldTypeParameterDto>? = null,
) {
    companion object {
        fun from(field: DataModelField): DataModelFieldDto {
            val parameters = field.type.parameters
            val dataTypeParameters = if (parameters.isEmpty()) {
                null
            } else {
                val valuesByName = field.dataTypeParameters.associateBy { it.id.name }
                parameters
                    .map { parameter ->
                        DataModelFieldTypeParameterDto(
                            name = parameter.id.name,
                            value = valuesByName[parameter.id.name]?.value,
                        )
                    }
                    .sortedBy { dto -> dto.name }
            }

            return DataModelFieldDto(
                fieldId = field.id,
                name = field.name,
                typeId = field.typeId,
                isPrimaryKey = field.isPrimaryKey,
                isNullable = field.isNullable,
                position = field.position,
                dataTypeParameters = dataTypeParameters,
            )
        }
    }
}
