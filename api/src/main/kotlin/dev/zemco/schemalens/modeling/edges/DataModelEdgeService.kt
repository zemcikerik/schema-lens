package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.modeling.models.DataModel

interface DataModelEdgeService {
    fun createEdge(model: DataModel, dto: DataModelEdgeInputDto): DataModelEdgeDto
    fun updateEdge(model: DataModel, edgeId: Long, dto: DataModelEdgeInputDto): DataModelEdgeDto
    fun deleteEdge(model: DataModel, edgeId: Long)
}
