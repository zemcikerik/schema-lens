package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.modeling.models.DataModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelEdgeServiceImpl(
    private val edgeRepository: DataModelEdgeRepository,
) : DataModelEdgeService {

    @Transactional
    override fun createEdge(model: DataModel, dto: DataModelEdgeInputDto): DataModelEdgeDto {
        val fromNode = model.findNode(dto.fromNodeId)
        val toNode = model.findNode(dto.toNodeId)

        val edge = DataModelEdge(
            modelId = model.id!!,
            model = model,
            fromNodeId = fromNode.id!!,
            fromNode = fromNode,
            toNodeId = toNode.id!!,
            toNode = toNode,
            type = dto.type,
            isMandatory = dto.isMandatory,
            isIdentifying = dto.isIdentifying,
        )

        edge.fields = dto.fields.asSequence().map { field ->
            val referencedField = model.findField(field.referencedFieldId)

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
        }.toMutableSet()

        val saved = edgeRepository.save(edge)
        return saved.mapToDto()
    }

    @Transactional
    override fun updateEdge(model: DataModel, edgeId: Long, dto: DataModelEdgeInputDto): DataModelEdgeDto {
        val edge = model.findEdge(edgeId)

        edge.apply {
            type = dto.type
            isMandatory = dto.isMandatory
            isIdentifying = dto.isIdentifying
            fields.clear()
        }

        dto.fields.forEach { field ->
            val referencedField = model.findField(field.referencedFieldId)

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
        val edge = model.findEdge(edgeId)
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
