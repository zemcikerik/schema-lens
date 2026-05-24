package dev.zemco.schemalens.modeling.types

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface DataModelDataTypeParameterRepository : JpaRepository<DataModelDataTypeParameter, DataModelDataTypeParameter.Id> {
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from DataModelDataTypeParameter p where p.id.typeId = ?1")
    fun deleteByTypeId(typeId: Long): Int
}

