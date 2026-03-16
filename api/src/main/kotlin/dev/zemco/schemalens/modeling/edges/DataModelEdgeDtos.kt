package dev.zemco.schemalens.modeling.edges

data class DataModelEdgeDto(
    var edgeId: Long? = null,
    var modelId: Long,
    var fromNodeId: Long,
    var toNodeId: Long,
    var type: DataModelEdgeType,
    var isMandatory: Boolean,
    var isIdentifying: Boolean,
    val fields: List<DataModelEdgeFieldDto>,
)

data class DataModelEdgeInputDto(
    var fromNodeId: Long,
    var toNodeId: Long,
    var type: DataModelEdgeType,
    var isMandatory: Boolean,
    var isIdentifying: Boolean,
    val fields: List<DataModelEdgeFieldDto>,
)
