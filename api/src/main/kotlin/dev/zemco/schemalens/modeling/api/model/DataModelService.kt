package dev.zemco.schemalens.modeling.api.model

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.modeling.api.dtos.DataModelDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelInputDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelLogicalDto

interface DataModelService {
    fun getAllModels(userId: Long): List<DataModelDto>
    fun createModel(dto: DataModelInputDto, user: User): DataModelDto
    fun updateModel(modelId: Long, dto: DataModelInputDto, ownerId: Long): DataModelDto
    fun deleteModel(modelId: Long, ownerId: Long)
    fun getLogicalModel(modelId: Long, userId: Long): DataModelLogicalDto
}
