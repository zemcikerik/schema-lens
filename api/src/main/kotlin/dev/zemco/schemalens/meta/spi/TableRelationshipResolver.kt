package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.TableRelationshipsMetadata
import javax.sql.DataSource

interface TableRelationshipResolver {
    fun readTableRelationships(dataSource: DataSource, tableName: String): TableRelationshipsMetadata
    fun readTableRelationships(dataSource: DataSource, tableNames: Set<String>): TableRelationshipsMetadata
}
