package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import jakarta.validation.constraints.NotBlank

data class DataModelNodeDto(
    val nodeId: Long,
    val name: String,
    val fields: List<DataModelFieldDto>,
) {
    companion object {
        fun from(node: DataModelNode): DataModelNodeDto =
            DataModelNodeDto(
                nodeId = node.id!!,
                name = node.name,
                fields = node.fields
                    .sortedBy { it.position }
                    .map { DataModelFieldDto.from(it) },
            )
    }
}

data class DataModelNodeInputDto(
    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    val name: String,
    val fields: List<DataModelFieldInputDto>,
)
