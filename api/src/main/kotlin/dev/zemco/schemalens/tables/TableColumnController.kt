package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.models.options.SetColumnUnusedOptions
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectRole
import dev.zemco.schemalens.projects.collaborators.ProjectCollaborationRole
import dev.zemco.schemalens.tables.models.SetColumnUnusedStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/project/{project}/table/{tableName}")
class TableColumnController(
    private val tableColumnService: TableColumnService,
) {

    @GetMapping("/column/{columnName}/unused/status")
    fun getColumnUnusedAvailability(
        @PathVariable @ProjectRole(ProjectCollaborationRole.CONTRIBUTOR) project: Project,
        @PathVariable tableName: String,
        @PathVariable columnName: String,
    ): ResponseEntity<SetColumnUnusedStatus> =
        ResponseEntity.ofNullable(tableColumnService.getColumnUnusedAvailability(project, tableName, columnName))

    @GetMapping("/column/{columnName}/unused/preview", produces = ["application/sql"])
    fun previewColumnUnused(
        @PathVariable @ProjectRole(ProjectCollaborationRole.CONTRIBUTOR) project: Project,
        @PathVariable tableName: String,
        @PathVariable columnName: String,
        @RequestParam cascadeConstraints: Boolean,
    ): ResponseEntity<String> =
        try {
            ResponseEntity.ofNullable(tableColumnService.previewSqlForSetColumnUnused(project, SetColumnUnusedOptions(
                tableName = tableName,
                columnName = columnName,
                cascadeConstraints = cascadeConstraints,
            )))
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        }

    @PostMapping("/column/{columnName}/unused")
    fun setColumnUnused(
        @PathVariable @ProjectRole(ProjectCollaborationRole.CONTRIBUTOR) project: Project,
        @PathVariable tableName: String,
        @PathVariable columnName: String,
        @RequestBody dto: SetColumnUnusedDto,
    ): ResponseEntity<Any> =
        try {
            if (tableColumnService.setColumnUnused(project, SetColumnUnusedOptions(
                tableName = tableName,
                columnName = columnName,
                cascadeConstraints = dto.cascadeConstraints,
            ))) ResponseEntity.noContent().build() else ResponseEntity.notFound().build()
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        }

}
