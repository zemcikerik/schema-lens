package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.ResourceNotFoundException
import dev.zemco.schemalens.modeling.models.DataModel

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelNodeServiceImpl(
    private val nodeRepository: DataModelNodeRepository,
) : DataModelNodeService {

    @Transactional
    override fun createNode(
        model: DataModel,
        dto: DataModelNodeInputDto,
    ): DataModelNodeDto {
        val node = DataModelNode(
            modelId = model.id!!,
            model = model,
            name = dto.name,
        )

        val saved = nodeRepository.save(node)

        return DataModelNodeDto(
            nodeId = saved.id!!,
            name = saved.name,
        )
    }


    @Transactional
    override fun updateNode(
        model: DataModel,
        nodeId: Long,
        dto: DataModelNodeInputDto,
    ): DataModelNodeDto {
        val node = findNode(model.id!!, nodeId)

        node.name = dto.name

        val saved = nodeRepository.save(node)

        return DataModelNodeDto(
            nodeId = saved.id!!,
            name = saved.name,
        )
    }

    @Transactional
    override fun deleteNode(
        model: DataModel,
        nodeId: Long,
    ) {
        val node = findNode(model.id!!, nodeId)
        nodeRepository.delete(node)
    }

    // TODO: maybe access directly from the model?
    private fun findNode(modelId: Long, nodeId: Long): DataModelNode {
        val node = nodeRepository.findById(nodeId)
            .orElseThrow { ResourceNotFoundException.withId("Node", nodeId) }

        if (node.modelId != modelId) {
            throw ResourceNotFoundException.withId("Node", nodeId)
        }

        return node
    }
}
