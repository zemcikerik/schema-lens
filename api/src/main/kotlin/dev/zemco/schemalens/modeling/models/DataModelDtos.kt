package dev.zemco.schemalens.modeling.models
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

data class DataModelDetailsDto(
    val dataTypes: List<DataModelDataTypeDto>,
    val nodes: List<DataModelNodeLogicalDto>,
    val edges: List<DataModelEdgeDto>
)
