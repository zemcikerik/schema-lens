package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.TableRelationshipsMetadata
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

    @GetMapping("{tableName}/related")
    fun getRelatedTableDetails(
        @PathVariable project: Project,
        @PathVariable tableName: String
    ): ResponseEntity<TableRelationshipsMetadata> =
        ResponseEntity.ofNullable(tableService.getRelatedTableDetails(project, tableName))

    @GetMapping("{tableName}/ddl", produces = ["application/sql"])
    fun generateDdl(@PathVariable project: Project, @PathVariable tableName: String): ResponseEntity<String> =
        ResponseEntity.ofNullable(tableService.generateDdlForTable(project, tableName))

}
