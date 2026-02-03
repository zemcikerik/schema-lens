package dev.zemco.schemalens.modeling.entity

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DataModelAttributeRepository : JpaRepository<DataModelAttribute, Long> {
    fun existsByTypeId(typeId: Long): Boolean
}

