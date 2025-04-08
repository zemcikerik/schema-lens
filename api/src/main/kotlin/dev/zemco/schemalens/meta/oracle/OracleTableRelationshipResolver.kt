package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.models.*
import dev.zemco.schemalens.meta.spi.*
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
@Qualifier("oracle")
class OracleTableRelationshipResolver(
    private val tableMetadataReader: OracleTableMetadataReader,
    private val tableRelationshipMetadataReader: OracleTableRelationshipMetadataReader
) : TableRelationshipResolver {

    override fun readDetailsOfTable(dataSource: DataSource, tableName: String): TableRelationshipsMetadata? =
        readDetailsOfTables(dataSource, setOf(tableName))

    override fun readDetailsOfTables(dataSource: DataSource, tableNames: Set<String>): TableRelationshipsMetadata? {
        if (!tableMetadataReader.checkIfTablesExists(dataSource, tableNames)) {
            return null
        }

        val relatedTableNames = tableRelationshipMetadataReader.readDirectlyRelatedTableNames(
            dataSource,
            tableNames,
        )
        val includedTableNames = relatedTableNames.asSequence().plus(tableNames).toSet()
        val tables = tableMetadataReader.readTableDetails(dataSource, includedTableNames)
        return internalReadDetailsOfTables(tables)
    }

    private fun internalReadDetailsOfTables(tables: Map<String, TableMetadata>): TableRelationshipsMetadata {
        val relationships = tables.values.flatMap { table ->
            val primaryKeyColumnNames = extractPrimaryKeyColumnNames(table.constraints)
            val nullableColumnNames = extractNullableColumnNames(table.columns)
            val uniqueColumnNameGroups = extractUniqueColumnNames(table.constraints)

            table.constraints.asSequence()
                .filterIsInstance<ForeignKeyConstraintMetadata>()
                .map {
                    RelationshipMetadata(
                        parentName = it.referencedTableName,
                        childName = table.name,
                        references = it.references.map { ref ->
                            RelationshipMetadata.ColumnReference(
                                parentColumnName = ref.referencedColumnName,
                                childColumnName = ref.columnName,
                            )
                        },
                        identifying = isIdentifying(it, primaryKeyColumnNames),
                        mandatory = isRequired(it, nullableColumnNames),
                        unique = isUnique(it, uniqueColumnNameGroups),
                    )
                }
        }

        return TableRelationshipsMetadata(
            tables = tables.map { it.value },
            relationships = relationships,
        )
    }

    private fun extractPrimaryKeyColumnNames(constraints: List<ConstraintMetadata>): Set<String> =
        constraints.asSequence()
            .filterIsInstance<PrimaryKeyConstraintMetadata>()
            .firstOrNull()?.columnNames?.toSet() ?: emptySet()

    private fun extractUniqueColumnNames(constraints: List<ConstraintMetadata>): Set<Set<String>> =
        constraints.asSequence()
            .filter { it is PrimaryKeyConstraintMetadata || it is UniqueConstraintMetadata }
            .map { it.columnNames.toSet() }
            .toSet()

    private fun extractNullableColumnNames(columns: List<ColumnMetadata>): Set<String> =
        columns.asSequence().filter { it.nullable }.map { it.name }.toSet()

    private fun isIdentifying(foreignKey: ForeignKeyConstraintMetadata, primaryKeyColumnNames: Set<String>): Boolean =
        primaryKeyColumnNames.containsAll(foreignKey.columnNames)

    private fun isUnique(foreignKey: ForeignKeyConstraintMetadata, uniqueColumnNames: Set<Set<String>>): Boolean =
        foreignKey.references.asSequence()
            .map { reference -> reference.columnName }
            .toSet()
            .let { uniqueColumnNames.contains(it) }

    private fun isRequired(foreignKey: ForeignKeyConstraintMetadata, nullableColumnNames: Set<String>): Boolean =
        foreignKey.references.asSequence()
            .map { it.columnName }
            .none { nullableColumnNames.contains(it) }

}
