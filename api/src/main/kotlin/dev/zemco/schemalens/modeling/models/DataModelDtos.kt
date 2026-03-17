package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.modeling.edges.DataModelEdgeDto
import dev.zemco.schemalens.modeling.nodes.DataModelNodeDto
import dev.zemco.schemalens.modeling.types.DataModelDataTypeDto
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelDto(
    val id: Long? = null,
    val name: String
) {
    companion object {
        fun from(model: DataModel): DataModelDto =
            DataModelDto(
                id = model.id,
                name = model.name,
            )
    }
}

data class DataModelInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String
)

data class DataModelDetailsDto(
    val dataTypes: List<DataModelDataTypeDto>,
    val nodes: List<DataModelNodeDto>,
    val edges: List<DataModelEdgeDto>
) {
    companion object {
        fun from(model: DataModel): DataModelDetailsDto =
            DataModelDetailsDto(
                dataTypes = model.dataTypes
                    .sortedBy { it.name }
                    .map { DataModelDataTypeDto.from(it) },
                nodes = model.nodes
                    .sortedBy { it.name }
                    .map { DataModelNodeDto.from(it) },
                edges = model.edges
                    .sortedBy { it.id }
                    .map { DataModelEdgeDto.from(it) },
            )
    }
}

data class DataModelModificationDto(
    val updatedNodes: List<DataModelNodeDto> = listOf(),
    val updatedEdges: List<DataModelEdgeDto> = listOf(),
) {
    companion object {
        fun emptyModification(): DataModelModificationDto = DataModelModificationDto(emptyList(), emptyList())
    }
}
