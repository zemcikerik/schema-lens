package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.DatabaseMetadataService
import dev.zemco.schemalens.meta.models.TableMetadata
import dev.zemco.schemalens.meta.models.TableRelationshipsMetadata
import dev.zemco.schemalens.meta.getForConnection
import dev.zemco.schemalens.meta.spi.SqlFormatter
import dev.zemco.schemalens.meta.spi.TableDdlGenerator
import dev.zemco.schemalens.meta.spi.TableMetadataReader
import dev.zemco.schemalens.meta.spi.TableRelationshipResolver
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectConnectionService
import org.springframework.stereotype.Service

@Service
class TableServiceImpl(
    private val connectionService: ProjectConnectionService,
    private val databaseMetadataService: DatabaseMetadataService,
) : TableService {

    override fun getTableList(project: Project): List<String> {
        val tableReader = databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo)
        return connectionService.withDataSource(project.connectionInfo) {
            tableReader.readTableNames(it)
        }
    }

    override fun getTableDetails(project: Project, tableName: String): TableMetadata? {
        val tableReader = databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo)
        return connectionService.withDataSource(project.connectionInfo) {
            if (tableReader.tableExists(it, tableName)) {
                tableReader.readTableDetails(it, tableName)
            } else null
        }
    }

    override fun getRelationshipsOfTable(project: Project, tableName: String): TableRelationshipsMetadata? {
        val tableReader = databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo)
        val relationshipResolver = databaseMetadataService.getForConnection<TableRelationshipResolver>(project.connectionInfo)

        return connectionService.withDataSource(project.connectionInfo) {
            if (tableReader.tableExists(it, tableName)) {
                relationshipResolver.readTableRelationships(it, tableName)
            } else null
        }
    }

    override fun getRelationshipsOfTables(project: Project, tableNames: List<String>): TableRelationshipsMetadata? {
        val tableReader = databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo)
        val relationshipResolver = databaseMetadataService.getForConnection<TableRelationshipResolver>(project.connectionInfo)
        val tableNamesSet = tableNames.toSet()

        return connectionService.withDataSource(project.connectionInfo) {
            if (tableReader.allTablesExists(it, tableNamesSet)) {
                relationshipResolver.readTableRelationships(it, tableNamesSet)
            } else null
        }
    }

    override fun generateDdlForTable(project: Project, tableName: String): String? {
        val tableReader = databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo)
        val ddlGenerator = databaseMetadataService.getForConnection<TableDdlGenerator>(project.connectionInfo)
        val sqlFormatter = databaseMetadataService.getForConnection<SqlFormatter>(project.connectionInfo)

        return connectionService.withDataSource(project.connectionInfo) {
            if (tableReader.tableExists(it, tableName)) {
                sqlFormatter.formatSql(ddlGenerator.generateDdlForTable(it, tableName))
            } else null
        }
    }
}
