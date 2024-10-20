package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.oracle.OracleTableMetadataReader
import dev.zemco.schemalens.projects.Project
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/project/{project}/table")
class TableController(
    private val oracleTableMetadataReader: OracleTableMetadataReader
) {

    @GetMapping
    fun listTables(@PathVariable project: Project): ResponseEntity<List<String>> {
        val dataSource = project.dbInfo?.toDataSource() ?: return ResponseEntity.status(HttpStatus.CONFLICT).build()
        return oracleTableMetadataReader.readTableList(dataSource).let { ResponseEntity.ok(it) }
    }

    @GetMapping("{tableName}/details")
    fun tableDetail(@PathVariable project: Project, @PathVariable tableName: String): ResponseEntity<TableMetadata> {
        val dataSource = project.dbInfo?.toDataSource() ?: return ResponseEntity.status(HttpStatus.CONFLICT).build()
        return oracleTableMetadataReader.readTableDetails(dataSource, tableName).let { ResponseEntity.ok(it) } //todo
    }

}
