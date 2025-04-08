package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.models.TableRelationshipsMetadata
import dev.zemco.schemalens.projects.Project
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/project/{project}")
class TableRelationshipController(
    private val tableService: TableService,
) {

    @GetMapping("table/{tableName}/related")
    fun getRelationshipsOfTable(
        @PathVariable project: Project,
        @PathVariable tableName: String
    ): ResponseEntity<TableRelationshipsMetadata> =
        ResponseEntity.ofNullable(tableService.getRelationshipsOfTable(project, tableName))

    @GetMapping("table-relationships")
    fun getRelationshipsOfTables(
        @PathVariable project: Project,
        @RequestParam(required = true) tableNames: List<String>
    ): ResponseEntity<TableRelationshipsMetadata> =
        ResponseEntity.ofNullable(tableService.getRelationshipsOfTables(project, tableNames))

}
