package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.UserService
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
            retrieveProject(projectId)
        }

        return project ?: throw ProjectNotFoundException(projectId)
    }

    private fun retrieveProjectUnsecure(projectId: UUID): Project? {
        logger.debug("Retrieving unsecured project with uuid: {}", projectId)
        return projectService.getProjectByUuid(projectId)
    }

    private fun retrieveProject(projectId: UUID): Project? {
        logger.debug("Retrieving secured project with id: {}", projectId)
        return projectService.getSecuredProjectByUuid(projectId, userService.getCurrentUser())
    }

    private companion object {
        @JvmStatic
        private val logger = LoggerFactory.getLogger(ProjectConverter::class.java)
    }

}

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class NoOwnershipCheck
