package dev.zemco.schemalens.modeling.edges

import dev.zemco.schemalens.modeling.models.DataModel
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/model/{modelId}/edge")
class DataModelEdgeController(
    private val edgeService: DataModelEdgeService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createEdge(
        @PathVariable modelId: DataModel,
        @RequestBody dto: DataModelEdgeInputDto,
    ): DataModelEdgeDto = edgeService.createEdge(modelId, dto)

    @PutMapping("/{edgeId}")
    fun updateEdge(
        @PathVariable modelId: DataModel,
        @PathVariable edgeId: Long,
        @RequestBody dto: DataModelEdgeInputDto,
    ): DataModelEdgeDto = edgeService.updateEdge(modelId, edgeId, dto)

    @DeleteMapping("/{edgeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteEdge(
        @PathVariable modelId: DataModel,
        @PathVariable edgeId: Long,
    ) {
        edgeService.deleteEdge(modelId, edgeId)
    }
}
