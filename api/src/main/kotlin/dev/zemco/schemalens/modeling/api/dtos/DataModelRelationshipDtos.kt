package dev.zemco.schemalens.modeling.api.dtos

data class DataModelRelationshipDto(
    var id: Long? = null,
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
