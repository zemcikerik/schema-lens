package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.TableMetadata
import javax.sql.DataSource

interface TableMetadataReader {
    fun tableExists(dataSource: DataSource, tableName: String): Boolean
    fun allTablesExists(dataSource: DataSource, tableNames: Set<String>): Boolean
    fun readTableNames(dataSource: DataSource): List<String>
    fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata
}
