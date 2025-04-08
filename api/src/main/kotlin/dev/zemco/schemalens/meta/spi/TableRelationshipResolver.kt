package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.TableRelationshipsMetadata
import javax.sql.DataSource

interface TableRelationshipResolver {
    fun readDetailsOfTable(dataSource: DataSource, tableName: String): TableRelationshipsMetadata?
    fun readDetailsOfTables(dataSource: DataSource, tableNames: Set<String>): TableRelationshipsMetadata?
}
