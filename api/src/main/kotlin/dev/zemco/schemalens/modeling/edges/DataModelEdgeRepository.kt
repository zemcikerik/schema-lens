package dev.zemco.schemalens.modeling.edges

import org.springframework.data.jpa.repository.JpaRepository

interface DataModelEdgeRepository : JpaRepository<DataModelEdge, Long> {
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelEdge?
    fun findAllByModelId(modelId: Long): List<DataModelEdge>
}
