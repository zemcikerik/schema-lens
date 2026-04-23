package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.modeling.diagrams.DataModelDiagramSimpleDto
import dev.zemco.schemalens.modeling.edges.DataModelEdgeDto
import dev.zemco.schemalens.modeling.nodes.DataModelNodeDto
import dev.zemco.schemalens.modeling.types.DataModelDataTypeDto
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelDto(
    val id: Long? = null,
    val name: String,
    val enabledContexts: DataModelEnabledContextsDto,
) {
    companion object {
        fun from(model: DataModel): DataModelDto =
            DataModelDto(
                id = model.id,
                name = model.name,
                enabledContexts = DataModelEnabledContextsDto.from(model.enabledContexts),
            )
    }
}

data class DataModelEnabledContextsDto(
    val oracleEnabled: Boolean = true,
) {
    companion object {
        fun from(enabledContexts: DataModelEnabledContexts): DataModelEnabledContextsDto =
            DataModelEnabledContextsDto(
                oracleEnabled = enabledContexts.oracleEnabled,
            )
    }

    fun toEntity(): DataModelEnabledContexts =
        DataModelEnabledContexts(
            oracleEnabled = oracleEnabled,
        )
}


data class DataModelInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String,
    val enabledContexts: DataModelEnabledContextsDto = DataModelEnabledContextsDto(),
)

data class DataModelDetailsDto(
    val enabledContexts: DataModelEnabledContextsDto,
    val dataTypes: List<DataModelDataTypeDto>,
    val nodes: List<DataModelNodeDto>,
    val edges: List<DataModelEdgeDto>,
    val diagrams: List<DataModelDiagramSimpleDto>,
) {
    companion object {
        fun from(model: DataModel): DataModelDetailsDto =
            DataModelDetailsDto(
                enabledContexts = DataModelEnabledContextsDto.from(model.enabledContexts),
                dataTypes = model.dataTypes
                    .sortedBy { it.name }
                    .map { DataModelDataTypeDto.from(it) },
                nodes = model.nodes
                    .sortedBy { it.name }
                    .map { DataModelNodeDto.from(it) },
                edges = model.edges.map { DataModelEdgeDto.from(it) },
                diagrams = model.diagrams.map { DataModelDiagramSimpleDto.from(it) },
            )
    }
}

data class DataModelModificationDto(
    val updatedNodes: List<DataModelNodeDto> = listOf(),
    val updatedEdges: List<DataModelEdgeDto> = listOf(),
    val deletedNodeIds: List<Long> = listOf(),
    val deletedEdgeIds: List<Long> = listOf(),
    val visuallyStaleNodeIds: List<Long> = listOf(),
)
