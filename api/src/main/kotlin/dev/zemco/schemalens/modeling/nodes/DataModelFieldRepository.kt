package dev.zemco.schemalens.modeling.nodes

import org.springframework.data.jpa.repository.JpaRepository

interface DataModelFieldRepository : JpaRepository<DataModelField, Long> {
    fun existsByTypeId(typeId: Long): Boolean
    fun findByIdAndNodeId(id: Long, nodeId: Long): DataModelField?
    fun findAllByNodeId(nodeId: Long): List<DataModelField>
}
