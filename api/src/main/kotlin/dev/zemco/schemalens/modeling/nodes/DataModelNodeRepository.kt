package dev.zemco.schemalens.modeling.nodes

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.jpa.repository.JpaRepository

interface DataModelNodeRepository : JpaRepository<DataModelNode, Long> {
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from DataModelNode n where n.modelId = ?1")
    fun bulkDeleteByModelId(modelId: Long): Int
}
