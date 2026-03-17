package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.modeling.models.DataModelModificationDto
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{model}/node")
class DataModelNodeController(
    private val service: DataModelNodeService,
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

    @DeleteMapping("/{nodeId}")
    fun deleteNode(
        @PathVariable model: DataModel,
        @PathVariable nodeId: Long,
    ): DataModelModificationDto = service.deleteNode(model, nodeId)
}
