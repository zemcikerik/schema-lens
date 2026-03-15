package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.ResourceNotFoundException
import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.nodes.DataModelFieldRepository
import dev.zemco.schemalens.modeling.nodes.DataModelNodeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelEdgeServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
    private val edgeRepository: DataModelEdgeRepository,
    private val fieldRepository: DataModelFieldRepository,
) : DataModelEdgeService {

    @Transactional
    override fun createEdge(model: DataModel, dto: DataModelEdgeInputDto): DataModelEdgeDto {
        val modelId = model.id!!

        val fromNode = nodeRepository.findByIdAndModelId(dto.fromNodeId, modelId)
            ?: throw ResourceNotFoundException.withId("Node", dto.fromNodeId)
        val toNode = nodeRepository.findByIdAndModelId(dto.toNodeId, modelId)
            ?: throw ResourceNotFoundException.withId("Node", dto.toNodeId)

        val edge = DataModelEdge(
            modelId = modelId,
            model = model,
            fromNodeId = fromNode.id!!,
            fromNode = fromNode,
            toNodeId = toNode.id!!,
            toNode = toNode,
            type = dto.type,
            isMandatory = dto.isMandatory,
            isIdentifying = dto.isIdentifying,
        )

        // TODO: maybe access directly from the model?
        edge.fields = dto.fields.map { field ->
            val referencedField = fieldRepository.findById(field.referencedFieldId)
                .orElseThrow { ResourceNotFoundException.withId("Field", field.referencedFieldId) }

            DataModelEdgeField(
                id = DataModelEdgeField.Id(
                    edgeId = 0,
                    referencedFieldId = referencedField.id!!,
                ),
                edge = edge,
                referencedField = referencedField,
                name = field.name,
                position = field.position,
            )
        }.toMutableList()

        val saved = edgeRepository.save(edge)
        return saved.mapToDto()
    }

    @Transactional
    override fun updateEdge(model: DataModel, edgeId: Long, dto: DataModelEdgeInputDto): DataModelEdgeDto {
        val modelId = model.id!!
        val edge = edgeRepository.findByIdAndModelId(edgeId, modelId)
            ?: throw ResourceNotFoundException.withId("Edge", edgeId)

        edge.apply {
            type = dto.type
            isMandatory = dto.isMandatory
            isIdentifying = dto.isIdentifying
            fields.clear()
        }

        // TODO: maybe access directly from the model?
        dto.fields.forEach { field ->
            val referencedField = fieldRepository.findById(field.referencedFieldId)
                .orElseThrow { ResourceNotFoundException.withId("Field", field.referencedFieldId) }

            edge.fields.add(
                DataModelEdgeField(
                    id = DataModelEdgeField.Id(
                        edgeId = edge.id!!,
                        referencedFieldId = referencedField.id!!,
                    ),
                    edge = edge,
                    referencedField = referencedField,
                    name = field.name,
                    position = field.position,
                )
            )
        }

        edgeRepository.save(edge)
        return edge.mapToDto()
    }

    @Transactional
    override fun deleteEdge(model: DataModel, edgeId: Long) {
        val edge = edgeRepository.findByIdAndModelId(edgeId, model.id!!)
            ?: throw ResourceNotFoundException.withId("Edge", edgeId)
        edgeRepository.delete(edge)
    }

    private fun DataModelEdge.mapToDto(): DataModelEdgeDto =
        DataModelEdgeDto(
            edgeId = id!!,
            modelId = modelId,
            fromNodeId = fromNodeId,
            toNodeId = toNodeId,
            type = type,
            isMandatory = isMandatory,
            isIdentifying = isIdentifying,
            fields = fields
                .sortedBy { it.position }
                .map {
                    DataModelEdgeFieldDto(
                        referencedFieldId = it.id.referencedFieldId,
                        name = it.name,
                        position = it.position,
                    )
                },
        )
}
