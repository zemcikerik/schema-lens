package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.modeling.edges.DataModelEdge
import dev.zemco.schemalens.modeling.edges.DataModelEdgeField
import dev.zemco.schemalens.modeling.nodes.DataModelField
import dev.zemco.schemalens.modeling.nodes.DataModelNode
import org.springframework.stereotype.Service
import kotlin.sequences.plus
import kotlin.sequences.sortedBy

@Service
class DataModelCascadeServiceImpl : DataModelCascadeService {

    override fun edgesInCascadeScope(startNode: DataModelNode): List<DataModelEdge> =
        edgesInCascadeScope(listOf(startNode))

    override fun edgesInCascadeScope(startNodes: Collection<DataModelNode>): List<DataModelEdge> {
        if (startNodes.isEmpty()) {
            return emptyList()
        }

        val model = startNodes.first().model

        val result = mutableListOf<DataModelEdge>()
        val visitedNodeIds = mutableSetOf<Long>()
        val outgoingEdgesByFromNodeId = model.edges.groupBy { it.fromNodeId }

        val queue = ArrayDeque<Long>()
        startNodes.forEach { queue.addLast(it.id!!) }

        while (queue.isNotEmpty()) {
            val currentNodeId = queue.removeFirst()

            if (!visitedNodeIds.add(currentNodeId)) {
                continue
            }

            val outgoingEdges = outgoingEdgesByFromNodeId[currentNodeId].orEmpty()

            outgoingEdges.forEach { edge ->
                result.add(edge)

                if (edge.isIdentifying) {
                    queue.addLast(edge.toNodeId)
                }
            }
        }

        return result
    }

    override fun syncReferencedFieldsFromPrimaryKey(model: DataModel, edge: DataModelEdge) {
        val fromNode = model.findNode(edge.fromNodeId)
        val toNode = model.findNode(edge.toNodeId)

        val primaryKeyFields = getSourcePrimaryKeyFields(model, fromNode)
        val existingByReferencedFieldId = edge.fields.associateBy { it.id.referencedFieldId }.toMutableMap()
        var nextPosition = getNextFieldPosition(model, toNode)
        val occupiedNames = collectOccupiedFieldNames(model, toNode, edge)

        primaryKeyFields.forEach { primaryKeyField ->
            val referencedFieldId = primaryKeyField.id!!
            val existingField = existingByReferencedFieldId[referencedFieldId]

            if (existingField != null) {
                existingByReferencedFieldId.remove(referencedFieldId)
                return@forEach
            }

            val uniqueName = resolveUniqueFieldName(primaryKeyField.name, occupiedNames)
            occupiedNames.add(uniqueName.uppercase())

            edge.fields.add(DataModelEdgeField(
                id = DataModelEdgeField.Id(
                    edgeId = edge.id ?: 0,
                    referencedFieldId = referencedFieldId,
                ),
                edge = edge,
                referencedField = primaryKeyField,
                name = uniqueName,
                position = nextPosition++,
            ))
        }

        existingByReferencedFieldId.values.forEach { edge.fields.remove(it) }
    }

    private fun collectOccupiedFieldNames(model: DataModel, node: DataModelNode, excludeEdge: DataModelEdge): MutableSet<String> {
        val directNames = node.fields.asSequence().map { it.name }

        val edgeNames = model.edges.asSequence()
            .filter { it.toNodeId == node.id && it !== excludeEdge }
            .flatMap { it.fields.asSequence() }
            .map { it.name }

        return (directNames + edgeNames)
            .map { it.uppercase() }
            .toMutableSet()
    }

    private fun resolveUniqueFieldName(baseName: String, occupiedNames: Set<String>): String {
        val uppercaseBaseName = baseName.uppercase()

        if (uppercaseBaseName !in occupiedNames) {
            return baseName
        }

        var suffix = 2
        while (true) {
            val candidate = "${baseName}_$suffix"
            val uppercaseCandidate = "${uppercaseBaseName}_$suffix"

            if (uppercaseCandidate !in occupiedNames) {
                return candidate
            }
            suffix++
        }
    }

    private fun getSourcePrimaryKeyFields(model: DataModel, node: DataModelNode): Sequence<DataModelField> {
        val directPrimaryKeyFields = node.fields
            .asSequence()
            .filter { it.isPrimaryKey }

        val identifyingEdgesFields = model.edges
            .asSequence()
            .filter { it.toNodeId == node.id && it.isIdentifying }
            .flatMap { it.fields }
            .map { it.referencedField }

        return (directPrimaryKeyFields + identifyingEdgesFields).sortedBy { it.position }
    }

    private fun getNextFieldPosition(model: DataModel, node: DataModelNode): Short {
        val directFieldPositions = node.fields.asSequence().map { it.position }

        val edgeFieldPositions = model.edges.asSequence()
            .filter { it.toNodeId == node.id }
            .flatMap { it.fields.asSequence() }
            .map { it.position }

        return (directFieldPositions + edgeFieldPositions).maxOrNull()?.plus(1)?.toShort() ?: 1
    }
}
