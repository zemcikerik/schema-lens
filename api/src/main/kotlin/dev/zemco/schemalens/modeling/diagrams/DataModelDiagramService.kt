package dev.zemco.schemalens.modeling.diagrams

import dev.zemco.schemalens.modeling.models.DataModel

interface DataModelDiagramService {
    fun getAllDiagrams(model: DataModel): List<DataModelDiagramSimpleDto>
    fun getDiagram(model: DataModel, diagramId: Long): DataModelDiagramDto
    fun createDiagram(model: DataModel, dto: DataModelDiagramInputDto): DataModelDiagramDto
    fun updateDiagram(model: DataModel, diagramId: Long, dto: DataModelDiagramInputDto): DataModelDiagramDto
    fun deleteDiagram(model: DataModel, diagramId: Long)
}
