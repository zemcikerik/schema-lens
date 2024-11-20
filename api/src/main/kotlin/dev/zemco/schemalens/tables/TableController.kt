package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectHasNoConnectionInfoException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/project/{project}/table")
class TableController(
    private val tableService: TableService,
) {

    @GetMapping
    fun listTables(@PathVariable project: Project): ResponseEntity<List<String>> = try {
        ResponseEntity.ok(tableService.getTableList(project))
    } catch (ex: ProjectHasNoConnectionInfoException) {
        ResponseEntity.status(HttpStatus.CONFLICT).build()
    }

    @GetMapping("{tableName}")
    fun tableDetail(@PathVariable project: Project, @PathVariable tableName: String): ResponseEntity<TableMetadata> = try {
        ResponseEntity.ofNullable(tableService.getTableDetails(project, tableName))
    } catch (ex: ProjectHasNoConnectionInfoException) {
        ResponseEntity.status(HttpStatus.CONFLICT).build()
    }

}
