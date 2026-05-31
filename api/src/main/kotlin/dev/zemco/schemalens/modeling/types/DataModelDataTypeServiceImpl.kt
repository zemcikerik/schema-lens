package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.modeling.models.DataModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeServiceImpl(
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val oracleService: DataModelDataTypeOracleService,
    private val parameterService: DataModelDataTypeParameterService,
) : DataModelDataTypeService {

    @Transactional
    override fun createDataType(model: DataModel, dto: DataModelDataTypeInputDto): DataModelDataTypeDto {
        val modelId = model.id!!
        val normalizedName = dto.name.trim()

        if (model.findDataTypeByNameOrNull(normalizedName) != null) {
            throw DataTypeExistsException(normalizedName)
        }

        val dataType = DataModelDataType(
            modelId = modelId,
            model = model,
            name = normalizedName,
        )

        return dataTypeRepository.save(dataType).syncAndMap(dto)
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

        return dataTypeRepository.save(dataType).syncAndMap(dto)
    }

    @Transactional
    override fun deleteDataType(model: DataModel, typeId: Long) {
        val dataType = model.findDataType(typeId)

        if (model.nodes.any { node -> node.fields.any { it.typeId == typeId } }) {
            throw DataTypeInUseException(typeId)
        }

        dataTypeRepository.delete(dataType)
    }

    private fun DataModelDataType.syncAndMap(dto: DataModelDataTypeInputDto): DataModelDataTypeDto {
        parameterService.syncParameters(this, dto.parameters)
        oracleService.syncOracle(this, dto.mappings)

        return DataModelDataTypeDto.from(this)
    }
}
