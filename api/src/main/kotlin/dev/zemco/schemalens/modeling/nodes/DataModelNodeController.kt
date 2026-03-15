package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{modelId}/entity")
class DataModelNodeController(
    private val service: DataModelNodeService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createNode(
        @PathVariable modelId: DataModel,
        @RequestBody @Validated(OnCreate::class) dto: DataModelNodeInputDto,
    ): DataModelNodeDto = service.createNode(modelId, dto)

    @PutMapping("/{entityId}")
    fun updateNode(
        @PathVariable modelId: DataModel,
        @PathVariable entityId: Long,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelNodeInputDto,
    ): DataModelNodeDto = service.updateNode(modelId, entityId, dto)

    @DeleteMapping("/{entityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteNode(
        @PathVariable modelId: DataModel,
        @PathVariable entityId: Long,
    ) {
        service.deleteNode(modelId, entityId)
    }
}
