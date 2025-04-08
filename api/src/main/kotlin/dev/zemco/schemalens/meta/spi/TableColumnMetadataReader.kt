package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.ColumnMetadata
import javax.sql.DataSource

interface TableColumnMetadataReader {
    fun checkIfTableColumnExists(dataSource: DataSource, tableName: String, columnName: String): Boolean
    fun readColumnsForTables(dataSource: DataSource, tableNames: Set<String>): Map<String, List<ColumnMetadata>>
}
