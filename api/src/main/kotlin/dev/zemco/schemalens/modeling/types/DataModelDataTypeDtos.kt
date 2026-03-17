package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelDataTypeInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String
)

data class DataModelDataTypeDto(
    val typeId: Long,
    val name: String
) {
    companion object {
        fun from(dataType: DataModelDataType): DataModelDataTypeDto =
            DataModelDataTypeDto(
                typeId = dataType.id!!,
                name = dataType.name,
            )
    }
}
