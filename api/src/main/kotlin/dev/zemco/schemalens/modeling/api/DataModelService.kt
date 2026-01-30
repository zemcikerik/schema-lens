package dev.zemco.schemalens.modeling.api

import dev.zemco.schemalens.modeling.api.dtos.DataModelDtos

interface DataModelService {
    fun getAllModels(userId: Long): List<DataModelDto>
    fun createModel(dto: DataModelInputDto, userId: Long): DataModelDto
    fun updateModel(modelId: Long, dto: DataModelInputDto, ownerId: Long): DataModelDto
    fun deleteModel(modelId: Long, ownerId: Long)
    fun getLogicalModel(modelId: Long, userId: Long): DataModelLogicalDto
}
