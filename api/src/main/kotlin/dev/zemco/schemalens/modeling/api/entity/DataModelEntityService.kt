package dev.zemco.schemalens.modeling.entity

interface DataModelEntityService {
    fun createEntity(modelId: Long, dto: DataModelEntityInputDto, userId: Long): DataModelEntityDto
    fun updateEntity(modelId: Long, entityId: Long, dto: DataModelEntityInputDto, userId: Long): DataModelEntityDto
    fun deleteEntity(modelId: Long, entityId: Long, userId: Long)
}
