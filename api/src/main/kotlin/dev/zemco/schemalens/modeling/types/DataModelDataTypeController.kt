package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.projects.OnCreate
import dev.zemco.schemalens.projects.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{modelId}/dataType")
class DataModelDataTypeController(
    private val service: DataModelDataTypeService,
) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createDataType(
        @PathVariable modelId: DataModel,
        @RequestBody @Validated(OnCreate::class) dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto = service.createDataType(modelId, dto)

    @PutMapping("/{typeId}")
    fun updateDataType(
        @PathVariable modelId: DataModel,
        @PathVariable typeId: Long,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto = service.updateDataType(modelId, typeId, dto)

    @DeleteMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteDataType(
        @PathVariable modelId: DataModel,
        @PathVariable typeId: Long
    ) {
        service.deleteDataType(modelId, typeId)
    }
}
