package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.TableMetadata
import javax.sql.DataSource

interface TableMetadataReader {
    fun readTableList(dataSource: DataSource): List<String>
    fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata?
}
