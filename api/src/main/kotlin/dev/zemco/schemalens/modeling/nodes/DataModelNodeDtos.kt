package dev.zemco.schemalens.modeling.nodes

import com.fasterxml.jackson.annotation.JsonProperty
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelNodeDto(
    @field:JsonProperty("entityId")
    val nodeId: Long,
    val name: String
)

data class DataModelNodeInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String
)

data class DataModelNodeLogicalDto(
    @field:JsonProperty("entityId")
    val nodeId: Long,
    val name: String,
    @field:JsonProperty("attributes")
    val fields: List<DataModelFieldDto>
)
