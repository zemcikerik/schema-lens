package dev.zemco.schemalens.modeling.diagrams

import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface DataModelDiagramRepository : JpaRepository<DataModelDiagram, Long> {
    @EntityGraph(attributePaths = ["nodes", "edges"])
    fun findByIdAndModelId(id: Long, modelId: Long): DataModelDiagram?
}
