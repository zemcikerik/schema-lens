package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank

data class DataModelDataTypeParameterDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String,
) {
    companion object {
        fun from(parameter: DataModelDataTypeParameter): DataModelDataTypeParameterDto =
            DataModelDataTypeParameterDto(name = parameter.id.name)
    }
}

data class DataModelDataTypeMappingDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val dbSystem: String,

    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val physicalDataType: String,

    val checkConstraint: String? = null,
) {
    companion object {
        fun from(oracle: DataModelDataTypeOracle): DataModelDataTypeMappingDto =
            DataModelDataTypeMappingDto(
                dbSystem = "oracle",
                physicalDataType = oracle.physical,
                checkConstraint = oracle.checkConstraint,
            )
    }
}

data class DataModelDataTypeInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String,

    @field:Valid
    val parameters: List<DataModelDataTypeParameterDto> = listOf(),

    @field:Valid
    val mappings: List<DataModelDataTypeMappingDto> = listOf(),
)

@Suppress("unused")
class DataModelDataTypeDto(
    val typeId: Long,
    val name: String,
    val parameters: List<DataModelDataTypeParameterDto> = emptyList(),
    val mappings: List<DataModelDataTypeMappingDto> = emptyList(),
) {
    companion object {
        fun from(dataType: DataModelDataType): DataModelDataTypeDto {
            val parameters = dataType.parameters
                .map { parameter -> DataModelDataTypeParameterDto.from(parameter) }
                .sortedBy { dto -> dto.name }

            val mappings = dataType.oracle
                ?.let { oracle -> listOf(DataModelDataTypeMappingDto.from(oracle)) }
                ?: emptyList()

            return DataModelDataTypeDto(
                dataType.id!!,
                dataType.name,
                parameters,
                mappings,
            )
        }
    }
}
