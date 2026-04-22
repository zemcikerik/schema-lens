package dev.zemco.schemalens.modeling.types

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.jpa.repository.JpaRepository

interface DataModelDataTypeRepository : JpaRepository<DataModelDataType, Long> {
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from DataModelDataType t where t.modelId = ?1")
    fun bulkDeleteByModelId(modelId: Long): Int
}
