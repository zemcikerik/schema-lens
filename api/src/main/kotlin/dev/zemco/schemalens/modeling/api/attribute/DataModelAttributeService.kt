package dev.zemco.schemalens.modeling.api.attribute

import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeInputDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelAttributeDto

interface DataModelAttributeService {
    fun createAttribute(
        modelId: Long,
        entityId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ): DataModelAttributeDto

    fun updateAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        request: DataModelAttributeInputDto,
        userId: Long
    ): DataModelAttributeDto

    fun deleteAttribute(
        modelId: Long,
        entityId: Long,
        attributeId: Long,
        userId: Long
    )
}
