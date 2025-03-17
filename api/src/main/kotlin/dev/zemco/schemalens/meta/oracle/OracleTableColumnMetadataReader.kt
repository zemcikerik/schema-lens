package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.models.ColumnMetadata
import dev.zemco.schemalens.meta.getNullableInt
import dev.zemco.schemalens.meta.spi.TableColumnMetadataReader
import dev.zemco.schemalens.meta.toNamedJdbcTemplate
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import java.sql.ResultSet
import javax.sql.DataSource

@Component
@Qualifier("oracle")
class OracleTableColumnMetadataReader : TableColumnMetadataReader {

    override fun checkIfTableColumnExists(dataSource: DataSource, tableName: String, columnName: String): Boolean {
        val params = MapSqlParameterSource(mapOf(
            "table_name" to tableName,
            "column_name" to columnName
        ))

        return dataSource.toNamedJdbcTemplate().queryForObject(COLUMN_EXISTS_SQL_QUERY, params, Boolean::class.java) ?: false
    }

    override fun readColumnsForTables(dataSource: DataSource, tableNames: Set<String>): Map<String, List<ColumnMetadata>> {
        val params = MapSqlParameterSource("table_names", tableNames)

        return dataSource.toNamedJdbcTemplate().query(GET_COLUMNS_SQL_QUERY, params) { rs, _ ->
            Pair(
                rs.getString("table_name"),
                ColumnMetadata(
                    name = rs.getString("column_name"),
                    position = rs.getInt("column_id"),
                    type = rs.extractColumnType(),
                    nullable = rs.getBoolean("nullable"),
                )
            )
        }.groupBy({ it.first }, { it.second })
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

        private val COLUMN_EXISTS_SQL_QUERY =
            """
                SELECT CASE WHEN EXISTS (
                    SELECT 'X'
                    FROM user_tab_columns
                    WHERE table_name = :table_name AND column_name = :column_name
                ) THEN 1 ELSE 0 END AS table_exists
                FROM DUAL
            """.trimIndent()

        private val GET_COLUMNS_SQL_QUERY =
            """
                SELECT table_name, column_name, column_id, data_type, data_length, data_precision, data_scale, nullable, char_length, char_used
                FROM user_tab_columns
                WHERE table_name IN (:table_names)
                ORDER BY column_id
            """.trimIndent()
    }

}
