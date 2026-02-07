package dev.zemco.schemalens.modeling.api.relationship

import dev.zemco.schemalens.modeling.api.dtos.*
import dev.zemco.schemalens.auth.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/model/{modelId}/relationship")
class DataModelRelationshipController(
    private val relationshipService: DataModelRelationshipService,
    private val userService: UserService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createRelationship(
        @PathVariable modelId: Long,
        @RequestBody dto: DataModelRelationshipInputDto,
    ): DataModelRelationshipDto {
        val user = userService.getCurrentUser()
        return relationshipService.createRelationship(modelId, dto, user.id!!)
    }

    @PutMapping("/{relationshipId}")
    fun updateRelationship(
        @PathVariable modelId: Long,
        @PathVariable relationshipId: Long,
        @RequestBody dto: DataModelRelationshipInputDto,
    ): DataModelRelationshipDto {
        val user = userService.getCurrentUser()
        return relationshipService.updateRelationship(modelId, relationshipId, dto, user.id!!)
    }

    @DeleteMapping("/{relationshipId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteRelationship(
        @PathVariable modelId: Long,
        @PathVariable relationshipId: Long,
    ) {
        val user = userService.getCurrentUser()
        relationshipService.deleteRelationship(modelId, relationshipId, user.id!!)
    }
}

