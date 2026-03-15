package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.ResourceNotFoundException
import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.nodes.DataModelFieldRepository

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeServiceImpl(
    private val fieldRepository: DataModelFieldRepository,
    private val dataTypeRepository: DataModelDataTypeRepository
) : DataModelDataTypeService {

    @Transactional
    override fun createDataType(model: DataModel, dto: DataModelDataTypeInputDto): DataModelDataTypeDto {
        val modelId = model.id!!

        if (dataTypeRepository.existsByModelIdAndNameIgnoreCase(modelId, dto.name)) {
            throw DataTypeExistsException(dto.name)
        }

        val dataType = DataModelDataType(
            modelId = modelId,
            model = model,
            name = dto.name.trim()
        )

        val saved = dataTypeRepository.save(dataType)

        return DataModelDataTypeDto(
            typeId = saved.id!!,
            name = saved.name
        )
    }

    @Transactional
    override fun updateDataType(model: DataModel, typeId: Long, dto: DataModelDataTypeInputDto): DataModelDataTypeDto {
        val modelId = model.id!!

        val dataType = dataTypeRepository.findByIdAndModelId(typeId, modelId)
            ?: throw ResourceNotFoundException.withId("Data type", typeId)

        // TODO: case sensitivity
        if (
            !dataType.name.equals(dto.name, ignoreCase = true) &&
            dataTypeRepository.existsByModelIdAndNameIgnoreCase(modelId, dto.name)
        ) {
            throw DataTypeExistsException(dto.name)
        }

        dataType.name = dto.name.trim()

        val saved = dataTypeRepository.save(dataType)

        return DataModelDataTypeDto(
            typeId = saved.id!!,
            name = saved.name
        )
    }

    @Transactional
    override fun deleteDataType(model: DataModel, typeId: Long) {
        val modelId = model.id!!

        val dataType = dataTypeRepository.findByIdAndModelId(typeId, modelId)
            ?: throw ResourceNotFoundException.withId("Data type", typeId)

        if (fieldRepository.existsByTypeId(typeId)) {
            throw DataTypeInUseException(typeId)
        }

        dataTypeRepository.delete(dataType)
    }
}
