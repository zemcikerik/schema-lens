package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel

interface DataModelNodeService {
    fun createNode(model: DataModel, dto: DataModelNodeInputDto): DataModelNodeDto
    fun updateNode(model: DataModel, nodeId: Long, dto: DataModelNodeInputDto): DataModelNodeDto
    fun deleteNode(model: DataModel, nodeId: Long)
}
