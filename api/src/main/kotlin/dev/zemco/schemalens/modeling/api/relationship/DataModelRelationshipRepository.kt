package dev.zemco.schemalens.modeling.api.relationship

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import dev.zemco.schemalens.modeling.logical.DataModelRelationship

interface DataModelRelationshipRepository : JpaRepository<DataModelRelationship, Long> {
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelRelationship?
    fun findAllByModelId(modelId: Long): List<DataModelRelationship>
}
