package dev.zemco.schemalens.modeling.api.attribute

interface DataModelAttributeService {
    fun createAttribute(
        modelId: Long,
        entityId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ): DataModelAttribute

    fun updateAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    )

    fun deleteAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        userId: Long
    )
}
