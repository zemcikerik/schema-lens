package dev.zemco.schemalens.meta.spi

import javax.sql.DataSource

interface TableRelationshipMetadataReader {
    fun readDependantTableNamesOnTableColumn(dataSource: DataSource, tableName: String, columnName: String): List<String>
}
