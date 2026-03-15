package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.modeling.models.DataModel

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeServiceImpl(
    private val dataTypeRepository: DataModelDataTypeRepository
) : DataModelDataTypeService {

    @Transactional
    override fun createDataType(model: DataModel, dto: DataModelDataTypeInputDto): DataModelDataTypeDto {
        val modelId = model.id!!
        val normalizedName = dto.name.trim()

        // TODO: make sure that name normalization also happens on FE and in nodes
        if (model.findDataTypeByNameOrNull(normalizedName) != null) {
            throw DataTypeExistsException(normalizedName)
        }

        val dataType = DataModelDataType(
            modelId = modelId,
            model = model,
            name = normalizedName
        )

        return dataTypeRepository.save(dataType).mapToDto()
    }

    @Transactional
    override fun updateDataType(model: DataModel, typeId: Long, dto: DataModelDataTypeInputDto): DataModelDataTypeDto {
        val normalizedName = dto.name.trim()
        val dataType = model.findDataType(typeId)
        val existingType = model.findDataTypeByNameOrNull(normalizedName)

        if (existingType != null && existingType.id != dataType.id) {
            throw DataTypeExistsException(normalizedName)
        }

        dataType.name = normalizedName

        return dataTypeRepository.save(dataType).mapToDto()
    }

    @Transactional
    override fun deleteDataType(model: DataModel, typeId: Long) {
        val dataType = model.findDataType(typeId)

        if (model.nodes.any { node -> node.fields.any { it.typeId == typeId } }) {
            throw DataTypeInUseException(typeId)
        }

        dataTypeRepository.delete(dataType)
    }

    private fun DataModelDataType.mapToDto(): DataModelDataTypeDto =
        DataModelDataTypeDto(
            typeId = id!!,
            name = name,
        )
}
