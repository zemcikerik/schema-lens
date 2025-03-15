package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.DatabaseMetadataService
import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.TableRelationshipsMetadata
import dev.zemco.schemalens.meta.getForConnection
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

    override fun getTableList(project: Project): List<String> =
        databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo).let { metadataReader ->
            connectionService.withDataSource(project.connectionInfo) {
                metadataReader.readTableList(it)
            }
        }

    override fun getTableDetails(project: Project, tableName: String): TableMetadata? =
        databaseMetadataService.getForConnection<TableMetadataReader>(project.connectionInfo).let { metadataReader ->
            connectionService.withDataSource(project.connectionInfo) {
                metadataReader.readTableDetails(it, tableName)
            }
        }

    override fun getRelatedTableDetails(project: Project, tableName: String): TableRelationshipsMetadata? =
        databaseMetadataService.getForConnection<TableRelationshipResolver>(project.connectionInfo).let { relationshipResolver ->
            connectionService.withDataSource(project.connectionInfo) {
                relationshipResolver.readDetailsOfDirectlyRelatedTables(it, tableName)
            }
        }

    override fun generateDdlForTable(project: Project, tableName: String): String? =
        databaseMetadataService.getForConnection<TableDdlGenerator>(project.connectionInfo).let { ddlGenerator ->
            connectionService.withDataSource(project.connectionInfo) {
                ddlGenerator.generateDdlForTable(it, tableName)
            }
        }

}
