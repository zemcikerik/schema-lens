package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.modeling.edges.DataModelEdgeDto
import dev.zemco.schemalens.modeling.edges.DataModelEdgeFieldDto
import dev.zemco.schemalens.modeling.edges.DataModelEdgeRepository
import dev.zemco.schemalens.modeling.nodes.DataModelFieldDto
import dev.zemco.schemalens.modeling.nodes.DataModelNodeLogicalDto
import dev.zemco.schemalens.modeling.nodes.DataModelNodeRepository
import dev.zemco.schemalens.modeling.nodes.DataModelFieldRepository
import dev.zemco.schemalens.modeling.types.DataModelDataTypeDto
import dev.zemco.schemalens.modeling.types.DataModelDataTypeRepository

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelServiceImpl(
    private val repository: DataModelRepository,
    private val dataTypeRepository: DataModelDataTypeRepository,
    private val nodeRepository: DataModelNodeRepository,
    private val fieldRepository: DataModelFieldRepository,
    private val edgeRepository: DataModelEdgeRepository
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
        val modelId = model.id!!

        // TODO: maybe access directly from the model?
        val dataTypes = dataTypeRepository.findAllByModelId(modelId)
            .map { DataModelDataTypeDto(it.id!!, it.name) }

        val nodes = nodeRepository.findAllByModelId(modelId)
            .map { node ->
                val fields = fieldRepository.findAllByNodeId(node.id!!)
                    .map { field ->
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
                    fields = fields,
                )
            }

        val edges = edgeRepository.findAllByModelId(modelId)
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

    override fun getDataModelById(modelId: Long): DataModel? = repository.findById(modelId).orElse(null)

    override fun getSecuredDataModelById(modelId: Long, user: User): DataModel? =
        repository.findByIdAndOwnerId(modelId, user.id!!)
}
