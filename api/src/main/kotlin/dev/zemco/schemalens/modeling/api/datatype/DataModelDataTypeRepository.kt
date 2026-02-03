package dev.zemco.schemalens.modeling.entity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DataModelDataTypeRepository : JpaRepository<DataModelDataType, Long> {
    fun existsByModelIdAndNameIgnoreCase(modelId: Long, name: String): Boolean

    fun findByIdAndModelId(id: Long, modelId: Long): DataModelDataType?
}
