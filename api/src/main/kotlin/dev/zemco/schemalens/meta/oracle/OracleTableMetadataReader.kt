package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.*
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class OracleTableMetadataReader(
    private val columnMetadataReader: OracleTableColumnMetadataReader,
    private val constraintMetadataReader: OracleTableConstraintMetadataReader
) : TableMetadataReader {

    override fun readTableList(dataSource: DataSource): List<String> =
        dataSource.toJdbcTemplate().queryForList(GET_TABLE_LIST_SQL_QUERY, String::class.java)

    override fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata? {
        if (!tableExists(dataSource, tableName)) {
            return null
        }

        val columns = columnMetadataReader.readTableColumns(dataSource, tableName)
        val constraints = constraintMetadataReader.readTableConstraints(dataSource, tableName)
        return TableMetadata(name = tableName, columns = columns, constraints = constraints)
    }

    private fun tableExists(dataSource: DataSource, tableName: String): Boolean {
        val params = MapSqlParameterSource("table_name", tableName)
        return dataSource.toNamedJdbcTemplate().queryForObject(TABLE_EXISTS_SQL_QUERY, params, Boolean::class.java) == true
    }

    private companion object {
        private const val GET_TABLE_LIST_SQL_QUERY = "SELECT table_name FROM user_tables"
        private val TABLE_EXISTS_SQL_QUERY = """
            SELECT CASE WHEN EXISTS (
                SELECT 1
                FROM user_tables
                WHERE table_name = UPPER(:table_name)
            ) THEN 1 ELSE 0 END
            FROM DUAL
        """.trimIndent()
    }

}
