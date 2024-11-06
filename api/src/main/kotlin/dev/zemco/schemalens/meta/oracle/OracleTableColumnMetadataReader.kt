package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.ColumnMetadata
import dev.zemco.schemalens.meta.getNullableInt
import dev.zemco.schemalens.meta.toNamedJdbcTemplate
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import java.sql.ResultSet
import javax.sql.DataSource

@Component
class OracleTableColumnMetadataReader {

    fun readTableColumns(dataSource: DataSource, tableName: String): List<ColumnMetadata> {
        val params = MapSqlParameterSource("table_name", tableName)

        return dataSource.toNamedJdbcTemplate().query(GET_COLUMNS_SQL_QUERY, params) { rs, _ ->
            ColumnMetadata(
                name = rs.getString("column_name"),
                position = rs.getInt("column_id"),
                type = rs.extractColumnType(),
                nullable = rs.getBoolean("nullable"),
            )
        }
    }

    private fun ResultSet.extractColumnType(): String {
        return when (val dataType = getString("data_type")) {
            "CHAR", "VARCHAR2", "NCHAR", "NVARCHAR2" -> {
                val length = getNullableInt("char_length") ?: DEFAULT_CHAR_LENGTH
                val hasCharSemantics = getString("char_used") == "C"
                val isVarChar = dataType === "VARCHAR2" || dataType === "NVARCHAR2"

                if (length == DEFAULT_CHAR_LENGTH && !hasCharSemantics && !isVarChar) {
                    dataType
                } else if (hasCharSemantics) {
                    "$dataType($length CHAR)"
                } else {
                    "$dataType($length)"
                }
            }

            "NUMBER" -> {
                val precision = getNullableInt("data_precision")
                val scale = getNullableInt("data_scale") ?: DEFAULT_NUMBER_SCALE

                if (precision == null) {
                    "NUMBER"
                } else if (scale == DEFAULT_NUMBER_SCALE) {
                    "NUMBER($precision)"
                } else {
                    "NUMBER($precision,$scale)"
                }
            }

            "FLOAT" -> {
                val precision = getNullableInt("data_precision") ?: DEFAULT_FLOAT_PRECISION
                if (precision != DEFAULT_FLOAT_PRECISION) "FLOAT($precision)" else "FLOAT"
            }

            "RAW" -> "RAW(${getInt("data_length")})"

            "UROWID" -> {
                val size = getNullableInt("data_length") ?: DEFAULT_UROWID_SIZE
                if (size != DEFAULT_UROWID_SIZE) "UROWID($size)" else "UROWID"
            }

            else -> dataType
        }
    }

    private companion object {
        private const val DEFAULT_CHAR_LENGTH = 1
        private const val DEFAULT_NUMBER_SCALE = 0
        private const val DEFAULT_FLOAT_PRECISION = 126
        private const val DEFAULT_UROWID_SIZE = 4000

        private val GET_COLUMNS_SQL_QUERY =
            """
                SELECT column_name, column_id, data_type, data_length, data_precision, data_scale, nullable, char_length, char_used
                FROM user_tab_columns
                WHERE table_name = UPPER(:table_name)
                ORDER BY column_id
            """.trimIndent()
    }

}
