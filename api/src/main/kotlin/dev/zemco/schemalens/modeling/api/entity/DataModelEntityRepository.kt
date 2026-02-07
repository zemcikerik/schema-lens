package dev.zemco.schemalens.modeling.api.entity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import dev.zemco.schemalens.modeling.logical.DataModelEntity

@Repository
interface DataModelEntityRepository : JpaRepository<DataModelEntity, Long> {
    fun findAllByModelId(modelId: Long): List<DataModelEntity>
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelEntity?
}
