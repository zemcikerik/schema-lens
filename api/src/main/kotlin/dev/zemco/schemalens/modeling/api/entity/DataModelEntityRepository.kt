package dev.zemco.schemalens.modeling.entity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DataModelEntityRepository : JpaRepository<DataModelEntity, Long> {
    fun findAllByModelId(modelId: Long): List<DataModelEntity>
}
