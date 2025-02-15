package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.IndexMetadata
import dev.zemco.schemalens.meta.IndexMetadata.IndexColumnDirection
import dev.zemco.schemalens.meta.IndexMetadata.IndexType
import dev.zemco.schemalens.meta.toNamedJdbcTemplate
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class OracleTableIndexMetadataReader {

    fun readIndexesOfTable(dataSource: DataSource, tableName: String): List<IndexMetadata> =
        readIndexesOfTables(dataSource, setOf(tableName))[tableName] ?: emptyList()

    fun readIndexesOfTables(dataSource: DataSource, tableNames: Set<String>): Map<String, List<IndexMetadata>> {
        val params = MapSqlParameterSource("table_names", tableNames)

        val entries = dataSource.toNamedJdbcTemplate().query(GET_INDEXES_SQL_QUERY, params) { rs, _ ->
            Pair(
                rs.getString("table_name"),
                IndexEntry(
                    name = rs.getString("index_name"),
                    type = rs.getString("index_type"),
                    unique = rs.getBoolean("uniqueness"),
                    logged = rs.getBoolean("logging"),
                    compressed = rs.getBoolean("compression"),
                    columnPosition = rs.getInt("column_position"),
                    descend = rs.getBoolean("descend"),
                    columnName = rs.getString("column_name"),
                    columnExpression = rs.getString("column_expression"),
                )
            )
        }

        return entries
            .groupBy({ it.first }, { it.second })
            .mapValues {
                it.value
                    .groupBy { entry -> entry.name }
                    .map { entry -> mapToIndex(entry.value) }
            }
    }

    private fun mapToIndex(indexEntries: List<IndexEntry>): IndexMetadata =
        indexEntries.first().run {
            IndexMetadata(
                name = name,
                type = mapToIndexType(type),
                unique = unique,
                logged = logged,
                compressed = compressed,
                columns = indexEntries.map {
                    IndexMetadata.IndexColumn(
                        position = it.columnPosition,
                        name = it.columnName,
                        expression = it.columnExpression,
                        direction = if (it.descend) IndexColumnDirection.DESCENDING else IndexColumnDirection.ASCENDING,
                    )
                }
            )
        }

    private fun mapToIndexType(type: String): IndexType =
        when (type) {
            "NORMAL" -> IndexType.NORMAL
            "NORMAL/REV" -> IndexType.NORMAL_REVERSE
            "BITMAP" -> IndexType.BITMAP
            "FUNCTION-BASED NORMAL" -> IndexType.FUNCTION_NORMAL
            "FUNCTION-BASED NORMAL/REV" -> IndexType.FUNCTION_NORMAL_REVERSE
            "FUNCTION-BASED BITMAP" -> IndexType.FUNCTION_BITMAP
            else -> throw IllegalArgumentException("Unknown index type: $type")
        }

    private companion object {
        private val GET_INDEXES_SQL_QUERY = """
            SELECT ind.table_name, ind.index_name, ind.index_type, DECODE(ind.uniqueness, 'UNIQUE', 1, 0) as uniqueness, DECODE(ind.compression, 'ENABLED', 1, 0) as compression,
                DECODE(ind.logging, 'YES', 1, 0) as logging, ind_col.column_position, DECODE(ind_col.descend, 'DESC', 1, 0) as descend, ind_col.column_name, ind_exp.column_expression
            FROM user_indexes ind
                LEFT JOIN user_ind_columns ind_col ON ind.index_name = ind_col.index_name
                LEFT JOIN user_ind_expressions ind_exp ON ind_col.index_name = ind_exp.index_name
                    AND ind_col.column_position = ind_exp.column_position
            WHERE ind.table_name IN (:table_names) AND ind.TABLE_TYPE = 'TABLE'
                AND ind.index_type IN ('NORMAL', 'NORMAL/REV', 'BITMAP', 'FUNCTION-BASED NORMAL', 'FUNCTION-BASED NORMAL/REV', 'FUNCTION-BASED BITMAP')
            ORDER BY ind.index_name, ind_col.column_position
        """.trimIndent()
    }

}

private data class IndexEntry(
    val name: String,
    val type: String,
    val unique: Boolean,
    val logged: Boolean,
    val compressed: Boolean,
    val columnPosition: Int,
    val descend: Boolean,
    val columnName: String,
    val columnExpression: String?,
)
