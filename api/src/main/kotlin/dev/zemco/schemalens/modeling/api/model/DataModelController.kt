package dev.zemco.schemalens.modeling.api.model

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.auth.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createModel(@RequestBody dto: DataModelInputDto): DataModelDto {
        val user = userService.getCurrentUser()
        return service.createModel(dto, user)
    }

    @PutMapping("/{modelId}")
    fun updateModel(
        @PathVariable modelId: Long,
        @RequestBody dto: DataModelInputDto
    ): DataModelDto {
        val user = userService.getCurrentUser()
        return service.updateModel(modelId, dto, user.id!!)
    }
    
    @DeleteMapping("/{modelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteModel(@PathVariable modelId: Long) {
        val user = userService.getCurrentUser()
        service.deleteModel(modelId, user.id!!)
    }
    
    @GetMapping("/{modelId}/logical")
    fun getLogicalModel(@PathVariable modelId: Long): DataModelLogicalDto {
        val user = userService.getCurrentUser()
        return service.getLogicalModel(modelId, user.id!!)
    }
}
