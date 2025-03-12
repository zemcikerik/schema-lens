package dev.zemco.schemalens.meta

import javax.sql.DataSource

interface TableRelationshipResolver {
    fun readDetailsOfDirectlyRelatedTables(dataSource: DataSource, tableName: String): TableRelationshipsMetadata?
}
