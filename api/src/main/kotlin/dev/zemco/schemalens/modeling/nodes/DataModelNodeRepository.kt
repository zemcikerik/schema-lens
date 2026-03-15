package dev.zemco.schemalens.modeling.nodes

import org.springframework.data.jpa.repository.JpaRepository

interface DataModelNodeRepository : JpaRepository<DataModelNode, Long>
