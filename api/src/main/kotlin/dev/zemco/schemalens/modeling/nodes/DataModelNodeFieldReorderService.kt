package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelModificationDto

interface DataModelNodeFieldReorderService {
    fun reorderNodeFields(model: DataModel, nodeId: Long, dto: DataModelFieldReorderInputDto): DataModelModificationDto
}
