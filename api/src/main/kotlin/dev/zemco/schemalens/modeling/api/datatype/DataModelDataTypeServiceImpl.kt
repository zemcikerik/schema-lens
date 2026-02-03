package dev.zemco.schemalens.modeling.entity

import dev.zemco.schemalens.modeling.DataModelRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeServiceImpl(
    private val modelRepository: DataModelRepository,
    private val dataTypeRepository: DataModelDataTypeRepository
) : DataModelDataTypeService {

    @Transactional
    override fun createDataType(
        modelId: Long,
        dto: DataModelDataTypeInputDto,
        userId: Long
    ): DataModelDataTypeDto {

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        if (dataTypeRepository.existsByModelIdAndNameIgnoreCase(modelId, dto.name)) {
            throw IllegalArgumentException("Data type with this name already exists")
        }

        val dataType = DataModelDataType(
            modelId = modelId,
            model = model,
            name = dto.name.trim()
        )

        val saved = dataTypeRepository.save(dataType)

        return DataModelDataTypeDto(
            id = saved.id!!,
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

        require(dto.name.isNotBlank()) { "Data type name cannot be blank" }

        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val dataType = dataTypeRepository.findByIdAndModelId(typeId, modelId)
            ?: throw EntityNotFoundException("Data type not found")

        if (
            !dataType.name.equals(dto.name, ignoreCase = true) &&
            dataTypeRepository.existsByModelIdAndNameIgnoreCase(modelId, dto.name)
        ) {
            throw IllegalArgumentException("Data type with this name already exists")
        }

        dataType.name = dto.name.trim()

        val saved = dataTypeRepository.save(dataType)

        return DataModelDataTypeDto(
            id = saved.id!!,
            name = saved.name
        )
    }

    @Transactional
    override fun deleteDataType(
        modelId: Long,
        typeId: Long,
        userId: Long
    ) {
        val model = modelRepository.findById(modelId)
            .orElseThrow { EntityNotFoundException("Model not found") }

        if (model.ownerId != userId) {
            throw IllegalAccessException("Access denied")
        }

        val dataType = dataTypeRepository.findByIdAndModelId(typeId, modelId)
            ?: throw EntityNotFoundException("Data type not found")

        if (attributeRepository.existsByTypeId(typeId)) {
            throw IllegalStateException("Data type is used by at least one attribute")
        }

        dataTypeRepository.delete(dataType)
    }
}
