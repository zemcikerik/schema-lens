package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel

interface DataModelFieldService {
    fun createField(model: DataModel, nodeId: Long, request: DataModelFieldInputDto): DataModelFieldDto
    fun updateField(model: DataModel, nodeId: Long, fieldId: Long, request: DataModelFieldInputDto): DataModelFieldDto
    fun deleteField(model: DataModel, nodeId: Long, fieldId: Long)
}
