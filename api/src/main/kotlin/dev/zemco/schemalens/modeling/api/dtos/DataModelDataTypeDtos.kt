package dev.zemco.schemalens.modeling.api.dtos

import dev.zemco.schemalens.projects.OnCreate
import dev.zemco.schemalens.projects.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelDataTypeInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String
)

data class DataModelDataTypeDto(
    val typeId: Long,
    val name: String
)
