package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.*
import dev.zemco.schemalens.meta.oracle.OracleTableRelationship.RelationshipType
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class OracleTableMetadataReader(
    private val columnMetadataReader: OracleTableColumnMetadataReader,
    private val constraintMetadataReader: OracleTableConstraintMetadataReader,
    private val indexMedataReader: OracleTableIndexMetadataReader,
) : TableMetadataReader {

    override fun readTableList(dataSource: DataSource): List<String> =
        dataSource.toJdbcTemplate().queryForList(GET_TABLE_LIST_SQL_QUERY, String::class.java)

    override fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata? =
        if (checkIfTablesExist(dataSource, setOf(tableName)))
            internalReadDetailsForTables(dataSource, setOf(tableName))[tableName]
        else null

    override fun readDetailsOfDirectlyRelatedTables(dataSource: DataSource, tableName: String): TableRelationshipsMetadata? {
        if (!checkIfTablesExist(dataSource, setOf(tableName))) {
            return null
        }

        val distinctRelationships = constraintMetadataReader.readDistinctDirectRelationshipsForTable(
            dataSource,
            tableName,
        )
        val distinctRelationshipsWithoutSelf = distinctRelationships.filter { it.tableName != tableName }
        val allRelatedTables = distinctRelationships.asSequence().map { it.tableName }.toSet()
        val tables = internalReadDetailsForTables(dataSource, allRelatedTables + tableName)

        val sourceTable = tables.getValue(tableName)
        val sourceTablePrimaryKeyColumnNames = extractPrimaryKeyColumnNames(sourceTable.constraints)
        val sourceTableNullableColumnNames = extractNullableColumnNames(sourceTable.columns)
        val sourceTableUniqueColumnNames = extractUniqueColumnNames(sourceTable.constraints)

        val relationshipsToParents = sourceTable.constraints.asSequence()
            .filterIsInstance<ForeignKeyConstraintMetadata>()
            .map {
                RelationshipMetadata(
                    parentName = it.referencedTableName,
                    childName = tableName,
                    identifying = isIdentifying(it, sourceTablePrimaryKeyColumnNames),
                    mandatory = isRequired(it, sourceTableNullableColumnNames),
                    unique = isUnique(it, sourceTableUniqueColumnNames),
                )
            }

        val relationshipsFromChildren = distinctRelationshipsWithoutSelf.asSequence()
            .filter { it.type == RelationshipType.CHILD }
            .flatMap {
                val table = tables.getValue(it.tableName)
                val primaryKeyColumnNames = extractPrimaryKeyColumnNames(table.constraints)
                val nullableColumnNames = extractNullableColumnNames(table.columns)
                val uniqueColumnNames = extractUniqueColumnNames(table.constraints)

                table.constraints.asSequence()
                    .filterIsInstance<ForeignKeyConstraintMetadata>()
                    .filter { foreignKey -> foreignKey.referencedTableName == tableName }
                    .map { foreignKey ->
                        RelationshipMetadata(
                            parentName = tableName,
                            childName = it.tableName,
                            identifying = isIdentifying(foreignKey, primaryKeyColumnNames),
                            mandatory = isRequired(foreignKey, nullableColumnNames),
                            unique = isUnique(foreignKey, uniqueColumnNames),
                        )
                    }
            }

        return TableRelationshipsMetadata(
            tables = tables.map { it.value },
            relationships = (relationshipsToParents + relationshipsFromChildren).toList(),
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

    private fun internalReadDetailsForTables(
        dataSource: DataSource,
        effectiveTableNames: Set<String>
    ): Map<String, TableMetadata> {
        val columns = columnMetadataReader.readColumnsForTables(dataSource, effectiveTableNames)
        val constraints = constraintMetadataReader.readConstraintsForTables(dataSource, effectiveTableNames)
        val indexes = indexMedataReader.readIndexesForTables(dataSource, effectiveTableNames)

        return effectiveTableNames.associateWith {
            TableMetadata(
                name = it,
                columns = columns[it] ?: emptyList(),
                constraints = constraints[it] ?: emptyList(),
                indexes = indexes[it] ?: emptyList(),
            )
        }
    }

    fun checkIfTablesExist(dataSource: DataSource, tableNames: Set<String>): Boolean {
        val params = MapSqlParameterSource("table_names", tableNames)
        val existingTableCount = dataSource.toNamedJdbcTemplate().queryForObject(TABLES_EXIST_SQL_QUERY, params, Int::class.java)
        return existingTableCount == tableNames.size
    }

    private companion object {
        private const val GET_TABLE_LIST_SQL_QUERY = "SELECT table_name FROM user_tables ORDER BY table_name"
        private const val TABLES_EXIST_SQL_QUERY = "SELECT COUNT(*) FROM user_tables WHERE table_name IN (:table_names)"
    }

}
