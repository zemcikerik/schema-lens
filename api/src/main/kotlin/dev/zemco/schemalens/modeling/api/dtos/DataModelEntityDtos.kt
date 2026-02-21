package dev.zemco.schemalens.modeling.api.dtos

import dev.zemco.schemalens.projects.OnCreate
import dev.zemco.schemalens.projects.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelEntityDto(
    val entityId: Long,
    val name: String
)

data class DataModelEntityInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String
)

data class DataModelEntityLogicalDto(
    val entityId: Long,
    val name: String,
    val attributes: List<DataModelAttributeDto>
)
