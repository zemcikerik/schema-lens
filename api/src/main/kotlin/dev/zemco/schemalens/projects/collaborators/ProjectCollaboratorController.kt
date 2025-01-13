package dev.zemco.schemalens.projects.collaborators

import dev.zemco.schemalens.auth.UserService
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectRole
import dev.zemco.schemalens.validation.UsernameConstraint
import org.hibernate.validator.constraints.Length
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/project")
class ProjectCollaboratorController(
    private val userService: UserService,
    private val projectCollaboratorService: ProjectCollaboratorService
) {

    @GetMapping("{project}/collaborator")
    fun getCollaborators(@PathVariable project: Project): List<ProjectCollaboratorDto> =
        projectCollaboratorService.getCollaboratorsIncludingOwnerFor(project).map{ it.mapToDto()  }

    @PostMapping("{project}/collaborator/{username}")
    fun addCollaborator(
        @PathVariable @ProjectRole(ProjectCollaborationRole.MANAGER) project: Project,
        @PathVariable @Length(min = 4, max = 64) @UsernameConstraint username: String,
        @RequestBody role: ProjectCollaborationRole,
    ): ResponseEntity<Any> {
        if (role === ProjectCollaborationRole.OWNER) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
        if (role === ProjectCollaborationRole.MANAGER && project.role !== ProjectCollaborationRole.OWNER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val user = userService.getUserByUsername(username)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        return projectCollaboratorService.addCollaborator(project, user, role)?.mapToDto()?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.status(HttpStatus.CONFLICT).build()
    }

    @PutMapping("{project}/collaborator/{username}")
    fun updateCollaborator(
        @PathVariable @ProjectRole(ProjectCollaborationRole.MANAGER) project: Project,
        @PathVariable @Length(min = 4, max = 64) @UsernameConstraint username: String,
        @RequestBody role: ProjectCollaborationRole,
    ): ResponseEntity<Any> {
        if (role === ProjectCollaborationRole.OWNER) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
        if (role === ProjectCollaborationRole.MANAGER && project.role !== ProjectCollaborationRole.OWNER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val collaborator = projectCollaboratorService.getCollaboratorForProject(project, username)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        collaborator.role = role
        return ResponseEntity.ok(projectCollaboratorService.saveCollaborator(collaborator).mapToDto())
    }

    @DeleteMapping("{project}/collaborator/{username}")
    fun deleteCollaborator(
        @PathVariable @ProjectRole(ProjectCollaborationRole.MANAGER) project: Project,
        @PathVariable @Length(min = 4, max = 64) @UsernameConstraint username: String,
    ): ResponseEntity<Any> {
        val collaborator = projectCollaboratorService.getCollaboratorForProject(project, username) ?:
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        if (collaborator.role === ProjectCollaborationRole.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        projectCollaboratorService.deleteCollaborator(collaborator)
        return ResponseEntity.noContent().build()
    }

    private fun ProjectCollaborator.mapToDto(): ProjectCollaboratorDto =
        ProjectCollaboratorDto(
            username = user.username,
            email = user.email,
            role = role,
        )

}
