package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelModificationDto

interface DataModelNodeService {
    fun createNode(model: DataModel, dto: DataModelNodeInputDto): DataModelNodeDto
    fun updateNode(model: DataModel, nodeId: Long, dto: DataModelNodeInputDto): DataModelModificationDto
    fun deleteNode(model: DataModel, nodeId: Long): DataModelModificationDto
}
