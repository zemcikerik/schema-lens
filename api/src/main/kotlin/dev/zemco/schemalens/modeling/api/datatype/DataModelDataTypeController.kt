package dev.zemco.schemalens.modeling.api.datatype

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.auth.UserService
import dev.zemco.schemalens.projects.OnCreate
import dev.zemco.schemalens.projects.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{modelId}/dataType")
class DataModelEntityDataTypeController(
    private val service: DataModelDataTypeService,
    private val userService: UserService
) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createDataType(
        @PathVariable modelId: Long,
        @RequestBody @Validated(OnCreate::class) dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto {
        val user = userService.getCurrentUser()
        return service.createDataType(modelId, dto, user.id!!)
    }

    @PutMapping("/{typeId}")
    fun updateDataType(
        @PathVariable modelId: Long,
        @PathVariable typeId: Long,
        @RequestBody @Validated(OnUpdate ::class) dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto {
        val user = userService.getCurrentUser()
        return service.updateDataType(modelId, typeId, dto, user.id!!)
    }

    @DeleteMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteDataType(
        @PathVariable modelId: Long,
        @PathVariable typeId: Long
    ) {
        val user = userService.getCurrentUser()
        service.deleteDataType(modelId, typeId, user.id!!)
    }
}
