package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelModificationDto

interface DataModelEdgeService {
    fun createEdge(model: DataModel, dto: DataModelEdgeInputDto): DataModelModificationDto
    fun updateEdge(model: DataModel, edgeId: Long, dto: DataModelEdgeInputDto): DataModelModificationDto
    fun deleteEdge(model: DataModel, edgeId: Long): DataModelModificationDto
}
