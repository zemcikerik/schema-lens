package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.projects.Project
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
    fun listTables(@PathVariable project: Project): List<String> =
        tableService.getTableList(project)

    @GetMapping("{tableName}")
    fun tableDetail(@PathVariable project: Project, @PathVariable tableName: String): ResponseEntity<TableMetadata> =
        ResponseEntity.ofNullable(tableService.getTableDetails(project, tableName))

}
