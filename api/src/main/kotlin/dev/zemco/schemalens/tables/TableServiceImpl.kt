package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.oracle.OracleTableMetadataReader
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.projects.ProjectHasNoConnectionInfoException
import org.springframework.stereotype.Service
import javax.sql.DataSource

@Service
class TableServiceImpl(
    private val oracleTableMetadataReader: OracleTableMetadataReader
) : TableService {

    override fun getTableList(project: Project): List<String> =
        oracleTableMetadataReader.readTableList(project.toDataSource())

    override fun getTableDetails(project: Project, tableName: String): TableMetadata? =
        oracleTableMetadataReader.readTableDetails(project.toDataSource(), tableName)

    private fun Project.toDataSource(): DataSource =
        connectionInfo?.toDataSource() ?: throw ProjectHasNoConnectionInfoException(uuid!!)

}
