package dev.zemco.schemalens.modeling.nodes

data class DataModelFieldReorderInputDto(
    val directFields: List<DataModelFieldReorderDto>,
    val edgeFields: List<DataModelEdgeFieldReorderDto>,
)

data class DataModelFieldReorderDto(
    val fieldId: Long,
    val position: Short,
)

data class DataModelEdgeFieldReorderDto(
    val edgeId: Long,
    val referencedFieldId: Long,
    val position: Short,
)
