package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.modeling.edges.DataModelEdgeDto
import dev.zemco.schemalens.modeling.edges.DataModelEdgeFieldDto
import dev.zemco.schemalens.modeling.nodes.DataModelFieldDto
import dev.zemco.schemalens.modeling.nodes.DataModelNodeLogicalDto
import dev.zemco.schemalens.modeling.types.DataModelDataTypeDto

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelServiceImpl(
    private val repository: DataModelRepository,
) : DataModelService {

    override fun getAllModels(userId: Long): List<DataModelDto> =
        repository.findAllByOwnerId(userId).map { DataModelDto(it.id, it.name) }

    @Transactional
    override fun createModel(dto: DataModelInputDto, user: User): DataModelDto {
        val entity = DataModel(name = dto.name, ownerId = user.id!!, owner = user)
        val saved = repository.save(entity)
        return DataModelDto(id = saved.id, name = saved.name)
    }

    @Transactional
    override fun updateModel(model: DataModel, dto: DataModelInputDto): DataModelDto {
        model.name = dto.name
        val saved = repository.save(model)
        return DataModelDto(id = saved.id, name = saved.name)
    }

    @Transactional
    override fun deleteModel(model: DataModel) {
        repository.delete(model)
    }

    @Transactional(readOnly = true)
    override fun getLogicalModel(model: DataModel): DataModelLogicalDto {
        val dataTypes = model.dataTypes
            .sortedBy { it.name }
            .map { DataModelDataTypeDto(it.id!!, it.name) }

        val nodes = model.nodes
            .sortedBy { it.name }
            .map { node ->
            val fields = node.fields.map { field ->
                DataModelFieldDto(
                    fieldId = field.id,
                    name = field.name,
                    typeId = field.typeId,
                    isPrimaryKey = field.isPrimaryKey,
                    isNullable = field.isNullable,
                    position = field.position,
                )
            }

            DataModelNodeLogicalDto(
                nodeId = node.id!!,
                name = node.name,
                fields = fields.sortedBy { it.position },
            )
        }

        val edges = model.edges
            .sortedBy { it.id }
            .map { edge ->
            DataModelEdgeDto(
                edgeId = edge.id!!,
                modelId = edge.modelId,
                fromNodeId = edge.fromNodeId,
                toNodeId = edge.toNodeId,
                type = edge.type,
                isMandatory = edge.isMandatory,
                isIdentifying = edge.isIdentifying,
                fields = edge.fields
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

        return DataModelLogicalDto(
            dataTypes = dataTypes,
            nodes = nodes,
            edges = edges,
        )
    }

    override fun getDataModelById(modelId: Long): DataModel? = repository.findModelTreeById(modelId)

    override fun getSecuredDataModelById(modelId: Long, user: User): DataModel? =
        repository.findModelTreeByIdAndOwnerId(modelId, user.id!!)
}
