package dev.zemco.schemalens.modeling.types

import org.springframework.data.jpa.repository.JpaRepository

interface DataModelDataTypeRepository : JpaRepository<DataModelDataType, Long> {
    fun existsByModelIdAndNameIgnoreCase(modelId: Long, name: String): Boolean
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelDataType?
    fun findAllByModelId(modelId: Long): List<DataModelDataType>
}
