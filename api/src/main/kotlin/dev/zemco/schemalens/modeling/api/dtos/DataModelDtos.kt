package dev.zemco.schemalens.modeling.api.dtos

data class DataModelDto(
    val id: Long? = null,
    val name: String
)

data class DataModelInputDto(
    val name: String
)

data class DataModelLogicalDto(
    val dataTypes: List<DataModelDataTypeDto>,
    val entities: List<DataModelEntityLogicalDto>,
    val relationships: List<DataModelRelationshipDto>
)
