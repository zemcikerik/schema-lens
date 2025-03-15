package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.TableRelationshipsMetadata
import javax.sql.DataSource

interface TableRelationshipResolver {
    fun readDetailsOfDirectlyRelatedTables(dataSource: DataSource, tableName: String): TableRelationshipsMetadata?
}
