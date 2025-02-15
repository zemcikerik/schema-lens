package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.*
import dev.zemco.schemalens.meta.oracle.OracleTableRelationship.RelationshipType
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

// todo: more than 1000 tables?
// todo: uppercase?

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

    override fun readDetailsOfDirectlyRelatedTables(dataSource: DataSource, tableName: String): RelatedTablesMetadata? {
        val effectiveTableName = tableName.uppercase()

        if (!checkIfTablesExist(dataSource, setOf(effectiveTableName))) {
            return null
        }

        val relationships = constraintMetadataReader.readDirectRelationshipsForTable(dataSource, effectiveTableName)
        val allRelatedTables = relationships.asSequence().map { it.tableName }.toSet()

        if (!checkIfTablesExist(dataSource, allRelatedTables)) {
            // todo: other schema?
            throw DataIntegrityViolationException("Table in a relationship with '$tableName' was not found")
        }

        val tableDetails = internalReadDetailsForTables(dataSource, allRelatedTables)

        return relationships.groupBy { it.type }.let {
            RelatedTablesMetadata(
                parents = it[RelationshipType.PARENT]?.map { r -> tableDetails.getValue(r.tableName) } ?: emptyList(),
                children = it[RelationshipType.CHILD]?.map { r -> tableDetails.getValue(r.tableName) } ?: emptyList(),
            )
        }
    }

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
