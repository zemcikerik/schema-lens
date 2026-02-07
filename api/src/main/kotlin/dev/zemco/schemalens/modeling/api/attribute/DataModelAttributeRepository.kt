package dev.zemco.schemalens.modeling.api.attribute

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import dev.zemco.schemalens.modeling.logical.DataModelAttribute

@Repository
interface DataModelAttributeRepository : JpaRepository<DataModelAttribute, Long> {
    fun existsByTypeId(typeId: Long): Boolean
    fun findByIdAndEntityId(id: Long, entityId: Long): DataModelAttribute?
    fun findAllByEntityId(entityId: Long): List<DataModelAttribute>
}

