package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.*
import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.spi.TableMetadataReader
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
@Qualifier("oracle")
class OracleTableMetadataReader(
    private val columnMetadataReader: OracleTableColumnMetadataReader,
    private val constraintMetadataReader: OracleTableConstraintMetadataReader,
    private val indexMedataReader: OracleTableIndexMetadataReader,
) : TableMetadataReader {

    override fun readTableList(dataSource: DataSource): List<String> =
        dataSource.toJdbcTemplate().queryForList(GET_TABLE_LIST_SQL_QUERY, String::class.java)

    override fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata? =
        if (checkIfTablesExist(dataSource, setOf(tableName)))
            readTableDetails(dataSource, setOf(tableName))[tableName]
        else null

    fun readTableDetails(dataSource: DataSource, tableNames: Set<String>): Map<String, TableMetadata> {
        val columns = columnMetadataReader.readColumnsForTables(dataSource, tableNames)
        val constraints = constraintMetadataReader.readConstraintsForTables(dataSource, tableNames)
        val indexes = indexMedataReader.readIndexesForTables(dataSource, tableNames)

        return tableNames.associateWith {
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
