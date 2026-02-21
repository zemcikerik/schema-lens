package dev.zemco.schemalens.modeling.api.dtos

import dev.zemco.schemalens.projects.OnCreate
import dev.zemco.schemalens.projects.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelDto(
    val id: Long? = null,
    val name: String
)

data class DataModelInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String
)

data class DataModelLogicalDto(
    val dataTypes: List<DataModelDataTypeDto>,
    val entities: List<DataModelEntityLogicalDto>,
    val relationships: List<DataModelRelationshipDto>
)
