package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.ConstraintMetadata
import javax.sql.DataSource

interface TableConstraintMetadataReader {
    fun readConstraintsForTable(dataSource: DataSource, tableName: String): List<ConstraintMetadata>
    fun readConstraintsForTables(dataSource: DataSource, tableNames: Set<String>): Map<String, List<ConstraintMetadata>>
}
