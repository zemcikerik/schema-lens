package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.modeling.edges.DataModelEdge
import dev.zemco.schemalens.modeling.nodes.DataModelNode

interface DataModelEdgeCascadeMutationService {
    fun syncReferencedFieldsFromPrimaryKey(model: DataModel, edge: DataModelEdge)
    fun collectCascadeEdgesAndSync(model: DataModel, fromNode: DataModelNode): List<DataModelEdge>
    fun collectCascadeEdgesAndSync(model: DataModel, fromNodes: Collection<DataModelNode>): List<DataModelEdge>
}
