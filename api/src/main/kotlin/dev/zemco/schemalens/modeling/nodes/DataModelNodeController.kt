package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelModificationDto
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{model}/node")
class DataModelNodeController(
    private val service: DataModelNodeService,
    private val reorderService: DataModelNodeFieldReorderService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createNode(
        @PathVariable model: DataModel,
        @RequestBody @Validated(OnCreate::class) dto: DataModelNodeInputDto,
    ): DataModelNodeDto = service.createNode(model, dto)

    @PutMapping("/{nodeId}")
    fun updateNode(
        @PathVariable model: DataModel,
        @PathVariable nodeId: Long,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelNodeInputDto,
    ): DataModelModificationDto = service.updateNode(model, nodeId, dto)

    @PutMapping("/{nodeId}/fields/reorder")
    fun reorderNodeFields(
        @PathVariable model: DataModel,
        @PathVariable nodeId: Long,
        @RequestBody @Validated dto: DataModelFieldReorderInputDto,
    ): ResponseEntity<DataModelModificationDto> =
        try {
            ResponseEntity.ok(reorderService.reorderNodeFields(model, nodeId, dto))
        } catch (_: DataModelNodeFieldReorderRequestInvalidException) {
            ResponseEntity.badRequest().build()
        }

    @DeleteMapping("/{nodeId}")
    fun deleteNode(
        @PathVariable model: DataModel,
        @PathVariable nodeId: Long,
    ): DataModelModificationDto = service.deleteNode(model, nodeId)
}
