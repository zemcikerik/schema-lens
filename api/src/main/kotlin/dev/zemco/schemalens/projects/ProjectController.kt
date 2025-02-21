package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.UserService
import dev.zemco.schemalens.projects.collaborators.ProjectCollaborationRole
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/project")
class ProjectController(
    private val projectService: ProjectService,
    private val userService: UserService,
) {

    @GetMapping
    fun listProjects(): List<ProjectListDto> =
        projectService.getSecuredProjects(userService.getCurrentUser()).map {
            ProjectListDto(id = it.uuid, name = it.name, owner = it.owner.username, currentUserRole = it.role)
        }

    @GetMapping("{project}")
    fun getProjectProperties(@PathVariable project: Project) = project.mapToPropertiesDto()

    @PostMapping
    fun createProject(@RequestBody @Validated(OnCreate::class) projectDto: OracleProjectPropertiesDto): OracleProjectPropertiesDto {
        val user = userService.getCurrentUser()
        val project = Project(
            name = projectDto.name.trim(),
            ownerId = user.id!!,
            owner = user,
            role = ProjectCollaborationRole.OWNER,
            connectionInfo = projectDto.connection.let {
                OracleProjectConnectionInfo(
                    host = it.host,
                    port = it.port,
                    username = it.username,
                    password = it.password!!,
                    service = it.service,
                    passwordChanged = true,
                )
            }
        )
        project.connectionInfo.project = project
        return projectService.saveProject(project).mapToPropertiesDto()
    }

    @PutMapping("{project}")
    fun updateProject(
        @PathVariable @ProjectRole(ProjectCollaborationRole.ADMIN) project: Project,
        @RequestBody @Validated(OnUpdate::class) projectDto: OracleProjectPropertiesDto
    ): OracleProjectPropertiesDto {
        project.name = projectDto.name.trim()
        (project.connectionInfo as OracleProjectConnectionInfo).let { connectionInfo ->
            connectionInfo.host = projectDto.connection.host
            connectionInfo.port = projectDto.connection.port
            connectionInfo.service = projectDto.connection.service
            connectionInfo.username = projectDto.connection.username

            if (projectDto.connection.password != null) {
                connectionInfo.password = projectDto.connection.password
                connectionInfo.passwordChanged = true
            }
        }
        return projectService.saveProject(project).mapToPropertiesDto()
    }

    @DeleteMapping("{project}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProject(@PathVariable @ProjectRole(ProjectCollaborationRole.OWNER) project: Project) =
        projectService.deleteProjectByUuid(project.uuid)

    private fun Project.mapToPropertiesDto(): OracleProjectPropertiesDto =
        OracleProjectPropertiesDto(
            id = uuid,
            name = name,
            owner = owner.username,
            currentUserRole = role,
            connection = connectionInfo.let {
                OracleProjectPropertiesDto.ConnectionDto(
                    host = it.host,
                    port = it.port,
                    username = it.username,
                    password = null,
                    service = (it as OracleProjectConnectionInfo).service
                )
            }
        )

}
