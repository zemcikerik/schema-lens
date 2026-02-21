package dev.zemco.schemalens

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.modeling.api.attribute.AttributeNotFoundException
import dev.zemco.schemalens.modeling.api.datatype.DataTypeExistsException
import dev.zemco.schemalens.modeling.api.datatype.DataTypeInUseException
import dev.zemco.schemalens.modeling.api.datatype.DataTypeNotFoundException
import dev.zemco.schemalens.modeling.api.entity.EntityNotFoundException
import dev.zemco.schemalens.modeling.api.model.DataModelNotFoundException
import dev.zemco.schemalens.modeling.api.relationship.RelationshipNotFoundException
import dev.zemco.schemalens.projects.ProjectConnectionException
import dev.zemco.schemalens.projects.ProjectConnectionFailureDto
import dev.zemco.schemalens.projects.ProjectNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalControllerAdvice {

    @ExceptionHandler(ResourceAccessDeniedException::class)
    fun handleResourceAccessDeniedException(ex: ResourceAccessDeniedException) =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.message)

    @ExceptionHandler(ProjectNotFoundException::class,
        DataModelNotFoundException::class,
        RelationshipNotFoundException::class,
        EntityNotFoundException::class,
        DataTypeNotFoundException::class,
        AttributeNotFoundException::class)
    fun handleNotFoundException(ex: RuntimeException) =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.message)

    @ExceptionHandler(DataTypeInUseException::class, DataTypeExistsException::class)
    fun handleDataTypeInUseAndExistsException(ex: RuntimeException) =
        ResponseEntity.status(HttpStatus.CONFLICT).body(ex.message)

    @ExceptionHandler(ProjectConnectionException::class)
    fun handleProjectConnectionException(ex: ProjectConnectionException) = ex.also { ex.printStackTrace() }.run {
        ResponseEntity.status(HttpStatus.CONFLICT)
            .contentType(MediaType.APPLICATION_JSON)
            .body(ProjectConnectionFailureDto(
                type = ex.type,
                message = ex.message,
            ))}

}
