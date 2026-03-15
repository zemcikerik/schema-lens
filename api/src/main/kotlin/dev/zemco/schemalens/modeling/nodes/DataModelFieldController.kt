package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.models.DataModel
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid

@RestController
@RequestMapping("/model/{modelId}/entity/{entityId}/attribute")
class DataModelFieldController(
    private val fieldService: DataModelFieldService,
) {
    @PostMapping
    fun createField(
        @PathVariable modelId: DataModel,
        @PathVariable entityId: Long,
        @Valid @RequestBody request: DataModelFieldInputDto,
    ): ResponseEntity<DataModelFieldDto> {
        return try {
            ResponseEntity.status(HttpStatus.CREATED).body(fieldService.createField(modelId, entityId, request))
        } catch (_: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/{attributeId}")
    fun updateField(
        @PathVariable modelId: DataModel,
        @PathVariable entityId: Long,
        @PathVariable attributeId: Long,
        @Valid @RequestBody request: DataModelFieldInputDto,
    ): ResponseEntity<DataModelFieldDto> {
        return try {
            ResponseEntity.ok(fieldService.updateField(modelId, entityId, attributeId, request))
        } catch (_: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        }
    }

    @DeleteMapping("/{attributeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteField(
        @PathVariable modelId: DataModel,
        @PathVariable entityId: Long,
        @PathVariable attributeId: Long,
    ) {
        fieldService.deleteField(modelId, entityId, attributeId)
    }
}
