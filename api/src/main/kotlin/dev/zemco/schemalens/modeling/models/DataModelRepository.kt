package dev.zemco.schemalens.modeling.models

import org.springframework.data.jpa.repository.JpaRepository

interface DataModelRepository : JpaRepository<DataModel, Long> {
    fun findAllByOwnerId(ownerId: Long): List<DataModel>
    fun findByIdAndOwnerId(id: Long, ownerId: Long): DataModel?
}
