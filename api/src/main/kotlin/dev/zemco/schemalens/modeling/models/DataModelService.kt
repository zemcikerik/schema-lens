package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.auth.User

interface DataModelService {
    fun getAllModels(userId: Long): List<DataModelDto>
    fun createModel(dto: DataModelInputDto, user: User): DataModelDto
    fun updateModel(model: DataModel, dto: DataModelInputDto): DataModelDto
    fun deleteModel(model: DataModel)
    fun getModelDetails(model: DataModel): DataModelDetailsDto
    fun getDataModelById(modelId: Long): DataModel?
    fun getSecuredDataModelById(modelId: Long, user: User): DataModel?
}
