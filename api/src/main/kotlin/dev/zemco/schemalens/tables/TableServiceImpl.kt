package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.oracle.OracleTableDdlGenerator
import dev.zemco.schemalens.meta.oracle.OracleTableMetadataReader
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectConnectionService
import org.springframework.stereotype.Service

@Service
class TableServiceImpl(
    private val connectionService: ProjectConnectionService,
    private val oracleTableMetadataReader: OracleTableMetadataReader,
    private val oracleTableDdlGenerator: OracleTableDdlGenerator,
) : TableService {

    override fun getTableList(project: Project): List<String> =
        connectionService.withDataSource(project.connectionInfo) {
            oracleTableMetadataReader.readTableList(it)
        }

    override fun getTableDetails(project: Project, tableName: String): TableMetadata? =
        connectionService.withDataSource(project.connectionInfo) {
            oracleTableMetadataReader.readTableDetails(it, tableName)
        }

    override fun generateDdlForTable(project: Project, tableName: String): String? =
        connectionService.withDataSource(project.connectionInfo) {
            oracleTableDdlGenerator.generateDdlForTable(it, tableName)
        }

}
