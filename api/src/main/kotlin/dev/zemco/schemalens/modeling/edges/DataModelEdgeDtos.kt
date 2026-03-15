package dev.zemco.schemalens.modeling.edges

import com.fasterxml.jackson.annotation.JsonProperty

data class DataModelEdgeDto(
    @field:JsonProperty("relationshipId")
    var edgeId: Long? = null,
    var modelId: Long,
    @field:JsonProperty("fromEntityId")
    var fromNodeId: Long,
    @field:JsonProperty("toEntityId")
    var toNodeId: Long,
    var type: DataModelEdgeType,
    var isMandatory: Boolean,
    var isIdentifying: Boolean,
    @field:JsonProperty("attributes")
    val fields: List<DataModelEdgeFieldDto>,
)

data class DataModelEdgeInputDto(
    @field:JsonProperty("fromEntityId")
    var fromNodeId: Long,
    @field:JsonProperty("toEntityId")
    var toNodeId: Long,
    var type: DataModelEdgeType,
    var isMandatory: Boolean,
    var isIdentifying: Boolean,
    @field:JsonProperty("attributes")
    val fields: List<DataModelEdgeFieldDto>,
)
