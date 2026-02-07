package dev.zemco.schemalens.modeling.api.model

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import dev.zemco.schemalens.modeling.DataModel

@Repository
interface DataModelRepository : JpaRepository<DataModel, Long> {
    fun findAllByOwnerId(ownerId: Long): List<DataModel>
}
