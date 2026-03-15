package dev.zemco.schemalens.modeling.models

import com.fasterxml.jackson.annotation.JsonProperty
import dev.zemco.schemalens.modeling.edges.DataModelEdgeDto
import dev.zemco.schemalens.modeling.nodes.DataModelNodeLogicalDto
import dev.zemco.schemalens.modeling.types.DataModelDataTypeDto
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
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
    @field:JsonProperty("entities")
    val nodes: List<DataModelNodeLogicalDto>,
    @field:JsonProperty("relationships")
    val edges: List<DataModelEdgeDto>
)
