package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.DatabaseMetadataService
import dev.zemco.schemalens.meta.getForConnection
import dev.zemco.schemalens.meta.models.options.SetColumnUnusedOptions
import dev.zemco.schemalens.meta.spi.*
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectConnectionInfo
import dev.zemco.schemalens.projects.ProjectConnectionService
import dev.zemco.schemalens.tables.models.SetColumnUnusedStatus
import org.springframework.stereotype.Service
import javax.sql.DataSource

@Service
class TableColumnServiceImpl(
    private val connectionService: ProjectConnectionService,
    private val databaseMetadataService: DatabaseMetadataService,
) : TableColumnService {

    override fun getColumnUnusedAvailability(
        project: Project,
        tableName: String,
        columnName: String,
    ): SetColumnUnusedStatus? =
        connectionService.withDataSource(project.connectionInfo) {
            getColumnUnusedAvailabilityForDataSource(project.connectionInfo, it, tableName, columnName)
        }

    private fun getColumnUnusedAvailabilityForDataSource(
        connectionInfo: ProjectConnectionInfo,
        dataSource: DataSource,
        tableName: String,
        columnName: String,
    ): SetColumnUnusedStatus? {
        val tableReader = databaseMetadataService.getForConnection<TableMetadataReader>(connectionInfo)
        val columnReader = databaseMetadataService.getForConnection<TableColumnMetadataReader>(connectionInfo)
        val columnWriter = databaseMetadataService.getForConnection<TableColumnMetadataWriter>(connectionInfo)
        val constraintReader = databaseMetadataService.getForConnection<TableConstraintMetadataReader>(connectionInfo)
        val relationshipReader = databaseMetadataService.getForConnection<TableRelationshipMetadataReader>(connectionInfo)

        if (!columnWriter.areUnusedColumnsSupported(dataSource)) {
            return SetColumnUnusedStatus.UNAVAILABLE
        }

        if (!tableReader.tableExists(dataSource, tableName)) {
            return null
        }

        if (!columnReader.columnExists(dataSource, tableName, columnName)) {
            return null
        }

        val referencedByTables = relationshipReader.readDependantTableNamesOnTableColumn(dataSource, tableName, columnName)
        val usedInMultiColumnConstraints = constraintReader.readConstraintsForTable(dataSource, tableName)
            .asSequence()
            .filter { c -> c.columnNames.run { size > 1 && contains(columnName) } }
            .map { c -> c.name }
            .toList()

        return SetColumnUnusedStatus(
            available = true,
            cascadeConstraintsRequired = referencedByTables.isNotEmpty() || usedInMultiColumnConstraints.isNotEmpty(),
            referencedByTables = referencedByTables,
            usedInMultiColumnConstraints = usedInMultiColumnConstraints,
        )
    }

    override fun previewSqlForSetColumnUnused(project: Project, options: SetColumnUnusedOptions): String? =
        connectionService.withDataSource(project.connectionInfo) {
            if (!(validateColumnUnusedOperationState(project, it, options) ?: return@withDataSource null))  {
                throw IllegalArgumentException("Invalid options for column state")
            }

            val columnWriter = databaseMetadataService.getForConnection<TableColumnMetadataWriter>(project.connectionInfo)
            val sqlFormatter = databaseMetadataService.getForConnection<SqlFormatter>(project.connectionInfo)
            sqlFormatter.formatSql(columnWriter.previewColumnUnused(it, options))
        }

    override fun setColumnUnused(project: Project, options: SetColumnUnusedOptions): Boolean =
        connectionService.withDataSource(project.connectionInfo) {
            if (!(validateColumnUnusedOperationState(project, it, options) ?: return@withDataSource false))  {
                throw IllegalArgumentException("Invalid options for column state")
            }

            val columnWriter = databaseMetadataService.getForConnection<TableColumnMetadataWriter>(project.connectionInfo)
            columnWriter.setColumnUnused(it, options)
            true
        }

    private fun validateColumnUnusedOperationState(
        project: Project,
        dataSource: DataSource,
        options: SetColumnUnusedOptions,
    ): Boolean? {
        val status = getColumnUnusedAvailabilityForDataSource(
            project.connectionInfo,
            dataSource,
            options.tableName,
            options.columnName
        ) ?: return null

        return status.available && (!status.cascadeConstraintsRequired || options.cascadeConstraints)
    }

}
