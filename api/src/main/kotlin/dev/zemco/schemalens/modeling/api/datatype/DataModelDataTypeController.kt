package dev.zemco.schemalens.modeling.api.datatype

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.auth.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/model/{modelId}/dataType")
class DataModelEntityController(
    private val service: DataModelEntityService,
    private val userService: UserService
) {
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createDataType(
        @PathVariable modelId: Long,
        @RequestBody @Valid dto: DataModelDataTypeInputDto
    ): DataModelDataTypeDto {
        val user = userService.getCurrentUser()
        return service.createDataType(modelId, dto, user.id!!)
    }

    @PutMapping("/{typeId}")
    fun updateDataType(
        @PathVariable modelId: Long,
        @PathVariable typeId: Long,
        @RequestBody @Valid dto: DataModelDataTypeInputDto
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
