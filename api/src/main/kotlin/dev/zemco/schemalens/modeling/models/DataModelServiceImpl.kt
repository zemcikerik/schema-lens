package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.auth.User

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelServiceImpl(
    private val repository: DataModelRepository,
) : DataModelService {

    override fun getAllModels(userId: Long): List<DataModelDto> =
        repository.findAllByOwnerId(userId).map { DataModelDto.from(it) }

    @Transactional
    override fun createModel(dto: DataModelInputDto, user: User): DataModelDto {
        val entity = DataModel(name = dto.name, ownerId = user.id!!, owner = user)
        val saved = repository.save(entity)
        return DataModelDto.from(saved)
    }

    @Transactional
    override fun updateModel(model: DataModel, dto: DataModelInputDto): DataModelDto {
        model.name = dto.name
        val saved = repository.save(model)
        return DataModelDto.from(saved)
    }

    @Transactional
    override fun deleteModel(model: DataModel) {
        repository.delete(model)
    }

    @Transactional(readOnly = true)
    override fun getModelDetails(model: DataModel): DataModelDetailsDto =
        DataModelDetailsDto.from(model)

    override fun getDataModelById(modelId: Long): DataModel? =
        repository.findModelTreeById(modelId)

    override fun getSecuredDataModelById(modelId: Long, user: User): DataModel? =
        repository.findModelTreeByIdAndOwnerId(modelId, user.id!!)
}
