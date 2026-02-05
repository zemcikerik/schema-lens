package dev.zemco.schemalens.modeling.api.relationship

import dev.zemco.schemalens.modeling.DataModel
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

interface DataModelRelationshipRepository : JpaRepository<DataModelRelationship, Long> {
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelRelationship?
}
