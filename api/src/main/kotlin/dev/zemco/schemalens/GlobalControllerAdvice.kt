package dev.zemco.schemalens

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.projects.ProjectConnectionException
import dev.zemco.schemalens.projects.ProjectConnectionFailureDto
import dev.zemco.schemalens.projects.ProjectNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class GlobalControllerAdvice {

    @ExceptionHandler(ResourceAccessDeniedException::class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    fun handleResourceAccessDeniedException(ex: ResourceAccessDeniedException) = ex

    @ExceptionHandler(ProjectNotFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleProjectNotFoundException(ex: ProjectNotFoundException) = ex

    @ExceptionHandler(ProjectConnectionException::class)
    fun handleProjectConnectionException(ex: ProjectConnectionException) = ex.also { ex.printStackTrace() }.run {
        ResponseEntity.status(HttpStatus.CONFLICT)
            .contentType(MediaType.APPLICATION_JSON)
            .body(ProjectConnectionFailureDto(
                type = ex.type,
                message = ex.message,
            ))}

}
