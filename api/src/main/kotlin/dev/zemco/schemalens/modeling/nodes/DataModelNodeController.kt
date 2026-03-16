package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{modelId}/node")
class DataModelNodeController(
    private val service: DataModelNodeService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createNode(
        @PathVariable modelId: DataModel,
        @RequestBody @Validated(OnCreate::class) dto: DataModelNodeInputDto,
    ): DataModelNodeDto = service.createNode(modelId, dto)

    @PutMapping("/{nodeId}")
    fun updateNode(
        @PathVariable modelId: DataModel,
        @PathVariable nodeId: Long,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelNodeInputDto,
    ): DataModelNodeDto = service.updateNode(modelId, nodeId, dto)

    @DeleteMapping("/{nodeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteNode(
        @PathVariable modelId: DataModel,
        @PathVariable nodeId: Long,
    ) {
        service.deleteNode(modelId, nodeId)
    }
}
