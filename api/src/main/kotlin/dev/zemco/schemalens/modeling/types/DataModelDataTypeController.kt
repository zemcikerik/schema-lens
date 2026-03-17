package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{model}/dataType")
class DataModelDataTypeController(
    private val service: DataModelDataTypeService,
) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createDataType(
        @PathVariable model: DataModel,
        @RequestBody @Validated(OnCreate::class) dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto = service.createDataType(model, dto)

    @PutMapping("/{typeId}")
    fun updateDataType(
        @PathVariable model: DataModel,
        @PathVariable typeId: Long,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto = service.updateDataType(model, typeId, dto)

    @DeleteMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteDataType(
        @PathVariable model: DataModel,
        @PathVariable typeId: Long
    ) {
        service.deleteDataType(model, typeId)
    }
}
