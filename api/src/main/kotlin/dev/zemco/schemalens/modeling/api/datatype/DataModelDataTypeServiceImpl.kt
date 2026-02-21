package dev.zemco.schemalens.modeling.api.datatype

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.modeling.DataModel
import dev.zemco.schemalens.modeling.logical.DataModelDataType
import dev.zemco.schemalens.modeling.api.model.DataModelRepository
import dev.zemco.schemalens.modeling.api.attribute.DataModelAttributeRepository
import dev.zemco.schemalens.modeling.api.dtos.DataModelDataTypeDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelDataTypeInputDto
import dev.zemco.schemalens.modeling.api.model.DataModelNotFoundException

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeServiceImpl(
    private val modelRepository: DataModelRepository,
    private val attributeRepository: DataModelAttributeRepository,
    private val dataTypeRepository: DataModelDataTypeRepository
) : DataModelDataTypeService {

    @Transactional
    override fun createDataType(
        modelId: Long,
        dto: DataModelDataTypeInputDto,
        userId: Long
    ): DataModelDataTypeDto {
        val model = findDataModel(userId, modelId)

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
    override fun updateDataType(
        modelId: Long,
        typeId: Long,
        dto: DataModelDataTypeInputDto,
        userId: Long
    ): DataModelDataTypeDto {
        findDataModel(userId, modelId)

        val dataType = dataTypeRepository.findByIdAndModelId(typeId, modelId)
            ?: throw DataTypeNotFoundException(typeId)

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
    override fun deleteDataType(
        modelId: Long,
        typeId: Long,
        userId: Long
    ) {
        findDataModel(userId, modelId)

        val dataType = dataTypeRepository.findByIdAndModelId(typeId, modelId)
            ?: throw DataTypeNotFoundException(typeId)

        if (attributeRepository.existsByTypeId(typeId)) {
            throw DataTypeInUseException(typeId)
        }

        dataTypeRepository.delete(dataType)
    }

    fun findDataModel(userId: Long, modelId: Long): DataModel {
        val optionalModel = modelRepository.findById(modelId)

        if (optionalModel.isEmpty) {
            throw DataModelNotFoundException(modelId)
        }

        val model = optionalModel.get()

        if (model.ownerId != userId) {
            throw ResourceAccessDeniedException()
        }

        return model
    }
}
