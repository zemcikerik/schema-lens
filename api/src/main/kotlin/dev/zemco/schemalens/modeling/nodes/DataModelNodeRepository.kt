package dev.zemco.schemalens.modeling.nodes

import org.springframework.data.jpa.repository.JpaRepository

interface DataModelNodeRepository : JpaRepository<DataModelNode, Long> {
    fun findAllByModelId(modelId: Long): List<DataModelNode>
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelNode?
}
