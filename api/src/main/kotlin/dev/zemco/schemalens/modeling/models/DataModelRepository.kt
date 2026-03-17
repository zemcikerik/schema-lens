package dev.zemco.schemalens.modeling.models

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.EntityGraph

interface DataModelRepository : JpaRepository<DataModel, Long> {
    fun findAllByOwnerId(ownerId: Long): List<DataModel>

    @EntityGraph(attributePaths = ["dataTypes", "nodes", "nodes.fields", "edges", "edges.fields", "diagrams"])
    fun findModelTreeById(id: Long): DataModel?

    @EntityGraph(attributePaths = ["dataTypes", "nodes", "nodes.fields", "edges", "edges.fields", "diagrams"])
    fun findModelTreeByIdAndOwnerId(id: Long, ownerId: Long): DataModel?
}
