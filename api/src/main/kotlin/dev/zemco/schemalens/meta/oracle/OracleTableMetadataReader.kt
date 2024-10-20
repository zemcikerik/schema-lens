package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.*
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import java.sql.ResultSet
import javax.sql.DataSource

@Component
class OracleTableMetadataReader : TableMetadataReader {

    override fun readTableList(dataSource: DataSource): List<String> =
        dataSource.toJdbcTemplate().query("SELECT table_name FROM user_tables") { rs, _ ->
            rs.getString("table_name")
        }

    override fun readTableDetails(dataSource: DataSource, tableName: String): TableMetadata? {
        val getColumnsParams = MapSqlParameterSource("table_name", tableName)
        val columns = dataSource.toNamedJdbcTemplate().query(GET_COLUMNS_SQL_QUERY, getColumnsParams) { rs, _ ->
            ColumnMetadata(
                name = rs.getString("column_name"),
                type = rs.extractColumnType(),
                nullable = rs.getBoolean("nullable"),
            )
        }

        if (columns.isEmpty()) {
            return null
        }
        return TableMetadata(name = tableName, columns = columns)
    }

    private fun ResultSet.extractColumnType(): String {
        getString("column_name").let { return it } // todo
    }

    private companion object {
        private val GET_COLUMNS_SQL_QUERY =
            """
                SELECT column_name, data_type, data_type_mod, data_type_owner, data_length, data_precision, data_scale, nullable, char_length, char_used
                FROM user_tab_columns
                WHERE table_name = UPPER(:table_name)
                ORDER BY column_id nulls last, column_name
            """.trimIndent()
    }

}
