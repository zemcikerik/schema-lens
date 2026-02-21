package dev.zemco.schemalens.modeling.api.entity

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.auth.UserService
import dev.zemco.schemalens.projects.OnCreate
import dev.zemco.schemalens.projects.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model/{modelId}/entity")
class DataModelEntityController(
    private val service: DataModelEntityService,
    private val userService: UserService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createEntity(
        @PathVariable modelId: Long,
        @RequestBody @Validated(OnCreate::class)  dto: DataModelEntityInputDto
    ): DataModelEntityDto {
        val user = userService.getCurrentUser()
        return service.createEntity(modelId, dto, user.id!!)
    }

    @PutMapping("/{entityId}")
    fun updateEntity(
        @PathVariable modelId: Long,
        @PathVariable entityId: Long,
        @RequestBody @Validated(OnUpdate::class)  dto: DataModelEntityInputDto
    ): DataModelEntityDto {
        val user = userService.getCurrentUser()
        return service.updateEntity(modelId, entityId, dto, user.id!!)
    }

    @DeleteMapping("/{entityId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteEntity(
        @PathVariable modelId: Long,
        @PathVariable entityId: Long
    ) {
        val user = userService.getCurrentUser()
        service.deleteEntity(modelId, entityId, user.id!!)
    }
}
