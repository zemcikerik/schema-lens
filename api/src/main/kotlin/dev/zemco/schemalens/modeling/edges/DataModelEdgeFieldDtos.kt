package dev.zemco.schemalens.modeling.edges

data class DataModelEdgeFieldDto(
    val referencedFieldId: Long,
    val name: String,
    val position: Short
)
