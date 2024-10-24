package dev.zemco.schemalens

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.projects.ProjectNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus

// TODO: maybe return unit
@ControllerAdvice
class GlobalControllerAdvice {

    @ExceptionHandler(ResourceAccessDeniedException::class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    fun handleResourceAccessDeniedException(ex: ResourceAccessDeniedException) = ex

    @ExceptionHandler(ProjectNotFoundException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleProjectNotFoundException(ex: ProjectNotFoundException) = ex

}
