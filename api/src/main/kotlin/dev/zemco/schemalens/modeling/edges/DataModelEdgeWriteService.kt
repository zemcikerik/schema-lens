package dev.zemco.schemalens.modeling.edges

interface DataModelEdgeWriteService {
    fun persistAndMapEdges(edges: List<DataModelEdge>): List<DataModelEdgeDto>
}
