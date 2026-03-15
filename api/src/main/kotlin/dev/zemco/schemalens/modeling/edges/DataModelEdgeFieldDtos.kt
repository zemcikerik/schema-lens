package dev.zemco.schemalens.modeling.edges

import com.fasterxml.jackson.annotation.JsonProperty

data class DataModelEdgeFieldDto(
    @field:JsonProperty("referencedAttributeId")
    val referencedFieldId: Long,
    val name: String,
    val position: Short
)
