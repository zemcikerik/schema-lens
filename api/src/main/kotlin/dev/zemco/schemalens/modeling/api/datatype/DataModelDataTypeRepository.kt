package dev.zemco.schemalens.modeling.api.datatype

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import dev.zemco.schemalens.modeling.logical.DataModelDataType

@Repository
interface DataModelDataTypeRepository : JpaRepository<DataModelDataType, Long> {
    fun existsByModelIdAndNameIgnoreCase(modelId: Long, name: String): Boolean
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelDataType?
    fun findAllByModelId(modelId: Long): List<DataModelDataType>
}
