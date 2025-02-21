package dev.zemco.schemalens.meta

import javax.sql.DataSource

interface TableMetadataReader {
    fun readTableList(dataSource: DataSource): List<String>
    fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata?
    fun readDetailsOfDirectlyRelatedTables(dataSource: DataSource, tableName: String): TableRelationshipsMetadata?
}
