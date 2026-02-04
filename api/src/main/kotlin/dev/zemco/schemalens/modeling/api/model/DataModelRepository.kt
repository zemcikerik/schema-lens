package dev.zemco.schemalens.modeling.api.model

import dev.zemco.schemalens.modeling.DataModel
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DataModelRepository : CrudRepository<DataModelDto, Long> {
    fun findAllByOwnerId(ownerId: Long): List<DataModel>
}
