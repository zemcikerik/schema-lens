package dev.zemco.schemalens.projects

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/project")
class ProjectController(
    private val projectService: ProjectService
) {

    @GetMapping
    fun listProjects(): List<ProjectListDto> =
        projectService.getProjects().map { ProjectListDto(id = it.uuid!!, name = it.name) }

}

data class ProjectListDto(
    val id: UUID,
    val name: String,
)
