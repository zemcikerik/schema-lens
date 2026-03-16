package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.auth.UserService
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated

@RestController
@RequestMapping("/model")
class DataModelController(
    private val service: DataModelService,
    private val userService: UserService
) {

    @GetMapping
    fun getAllModels(): List<DataModelDto> {
        val user = userService.getCurrentUser()
        return service.getAllModels(user.id!!)
    }

    @GetMapping("/{modelId}")
    fun getModel(@PathVariable modelId: DataModel): DataModelDetailsDto =
        service.getModelDetails(modelId)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createModel(@RequestBody @Validated(OnCreate::class) dto: DataModelInputDto): DataModelDto {
        val user = userService.getCurrentUser()
        return service.createModel(dto, user)
    }

    @PutMapping("/{modelId}")
    fun updateModel(
        @PathVariable modelId: DataModel,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelInputDto
    ): DataModelDto = service.updateModel(modelId, dto)
    
    @DeleteMapping("/{modelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteModel(@PathVariable modelId: DataModel) {
        service.deleteModel(modelId)
    }
}
