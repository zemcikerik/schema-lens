package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.TableMetadata
import javax.sql.DataSource

interface TableMetadataReader {
    fun checkIfTableExists(dataSource: DataSource, tableName: String): Boolean
    fun readTableList(dataSource: DataSource): List<String>
    fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata?
}
