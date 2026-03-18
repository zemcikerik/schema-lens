package dev.zemco.schemalens.modeling.edges

import org.springframework.stereotype.Service

@Service
class DataModelEdgeWriteServiceImpl(
    private val edgeRepository: DataModelEdgeRepository,
) : DataModelEdgeWriteService {

    override fun persistAndMapEdges(edges: List<DataModelEdge>): List<DataModelEdgeDto> {
        if (edges.isEmpty()) {
            return emptyList()
        }

        val persistedById = edgeRepository.saveAll(edges).associateBy { it.id!! }

        return edges
            .asSequence()
            .map { it.id!! }
            .map { persistedById[it]!! }
            .map { DataModelEdgeDto.from(it) }
            .toList()
    }
}
