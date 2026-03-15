package dev.zemco.schemalens.modeling.nodes

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

        return nodeRepository.save(node).mapToDto()
    }

    @Transactional
    override fun updateNode(
        model: DataModel,
        nodeId: Long,
        dto: DataModelNodeInputDto,
    ): DataModelNodeDto {
        val node = model.findNode(nodeId).apply {
            name = dto.name
        }

        return nodeRepository.save(node).mapToDto()
    }

    @Transactional
    override fun deleteNode(
        model: DataModel,
        nodeId: Long,
    ) {
        val node = model.findNode(nodeId)
        nodeRepository.delete(node)
    }

    private fun DataModelNode.mapToDto(): DataModelNodeDto =
        DataModelNodeDto(
            nodeId = id!!,
            name = name,
        )
}
