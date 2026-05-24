package dev.zemco.schemalens.modeling.types

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface DataModelDataTypeOracleRepository : JpaRepository<DataModelDataTypeOracle, Long> {
    fun findByTypeId(typeId: Long): DataModelDataTypeOracle?

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from DataModelDataTypeOracle o where o.typeId = ?1")
    fun deleteByTypeId(typeId: Long): Int
}

