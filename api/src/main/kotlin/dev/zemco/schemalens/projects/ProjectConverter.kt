package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.auth.UserService
import dev.zemco.schemalens.projects.collaborators.ProjectCollaborationRole
import org.slf4j.LoggerFactory
import org.springframework.core.convert.TypeDescriptor
import org.springframework.core.convert.converter.GenericConverter
import org.springframework.core.convert.converter.GenericConverter.ConvertiblePair
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class ProjectConverter(
    private val projectService: ProjectService,
    private val userService: UserService
) : GenericConverter {

    override fun getConvertibleTypes(): Set<ConvertiblePair> {
        return setOf(ConvertiblePair(String::class.java, Project::class.java))
    }

    override fun convert(source: Any?, sourceType: TypeDescriptor, targetType: TypeDescriptor): Any? {
        val rawProjectId = source as String? ?: throw IllegalArgumentException("Project ID must be specified!")
        val projectId = UUID.fromString(rawProjectId)

        val project = if (targetType.hasAnnotation(NoOwnershipCheck::class.java)) {
            retrieveProjectUnsecure(projectId)
        } else {
            retrieveProject(projectId, targetType)
        }

        return project ?: throw ProjectNotFoundException(projectId)
    }

    private fun retrieveProjectUnsecure(projectId: UUID): Project? {
        LOGGER.debug("Retrieving unsecured project with uuid: {}", projectId)
        return projectService.getProjectByUuid(projectId)
    }

    private fun retrieveProject(projectId: UUID, targetType: TypeDescriptor): Project? {
        LOGGER.debug("Retrieving secured project with id: {}", projectId)
        val user = userService.getCurrentUser()
        val project = projectService.getSecuredProjectByUuid(projectId, user) ?: return null
        val requiredRole = targetType.getAnnotation(ProjectRole::class.java)?.role ?: return project

        if (project.role!! > requiredRole) {
            LOGGER.error("User {} does not have required role {} for project {}", user.id, requiredRole, projectId)
            throw ResourceAccessDeniedException()
        }

        return project
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(ProjectConverter::class.java)
    }

}

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class NoOwnershipCheck

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class ProjectRole(val role: ProjectCollaborationRole)
