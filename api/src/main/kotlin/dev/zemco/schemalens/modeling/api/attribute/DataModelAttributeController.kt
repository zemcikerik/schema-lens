package dev.zemco.schemalens.modeling.api.attribute

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.auth.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/model/{modelId}/entity/{entityId}/attribute")
class DataModelAttributeController(
    private val attributeService: DataModelAttributeService,
    private val userService: UserService
) {
    @PostMapping
    fun createAttribute(
        @PathVariable modelId: Long,
        @PathVariable entityId: Long,
        @Valid @RequestBody request: DataModelAttributeInputDto,
    ): ResponseEntity<Void> {
        val user = userService.getCurrentUser()
        try {
            attributeService.createAttribute(modelId, entityId, request, user.id!!)
            return ResponseEntity.status(HttpStatus.CREATED).build()
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }
    }

    @PutMapping("/{attributeId}")
    fun updateAttribute(
        @PathVariable modelId: Long,
        @PathVariable entityId: Long,
        @PathVariable attributeId: Long,
        @Valid @RequestBody request: DataModelAttributeInputDto,
    ): ResponseEntity<Void> {
        val user = userService.getCurrentUser()
        try {
            attributeService.updateAttribute(modelId, entityId, attributeId, request, user.id!!)
            return ResponseEntity.noContent().build()
        } catch (e: IllegalArgumentException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }
    }

    @DeleteMapping("/{attributeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteAttribute(
        @PathVariable modelId: Long,
        @PathVariable entityId: Long,
        @PathVariable attributeId: Long,
    ) {
        val user = userService.getCurrentUser()
        attributeService.deleteAttribute(modelId, entityId, attributeId, user.id!!)
    }
}
