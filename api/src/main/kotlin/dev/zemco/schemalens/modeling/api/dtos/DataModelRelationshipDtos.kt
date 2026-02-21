package dev.zemco.schemalens.modeling.api.dtos

import dev.zemco.schemalens.modeling.logical.DataModelRelationshipType

data class DataModelRelationshipDto(
    var relationshipId: Long? = null,
    var modelId: Long,
    var fromEntityId: Long,
    var toEntityId: Long,
    var type: DataModelRelationshipType,
    var isMandatory: Boolean,
    var isIdentifying: Boolean,
    val attributes: List<DataModelRelationshipAttributeDto>,
)

data class DataModelRelationshipInputDto(
    var fromEntityId: Long,
    var toEntityId: Long,
    var type: DataModelRelationshipType,
    var isMandatory: Boolean,
    var isIdentifying: Boolean,
    val attributes: List<DataModelRelationshipAttributeDto>,
)
