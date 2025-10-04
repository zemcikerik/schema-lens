package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.*
import dev.zemco.schemalens.meta.models.*
import dev.zemco.schemalens.meta.spi.TableConstraintMetadataReader
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
@Qualifier("oracle")
class OracleTableConstraintMetadataReader : TableConstraintMetadataReader {

    override fun readConstraintsForTable(dataSource: DataSource, tableName: String): List<ConstraintMetadata> =
        readConstraintsForTables(dataSource, setOf(tableName)).getValue(tableName)

    override fun readConstraintsForTables(dataSource: DataSource, tableNames: Set<String>): Map<String, List<ConstraintMetadata>> {
        val params = MapSqlParameterSource("table_names", tableNames)

        val entries = dataSource.toNamedJdbcTemplate().query(GET_CONSTRAINTS_SQL_QUERY, params) { rs, _ ->
            Pair(
                rs.getString("table_name"),
                ConstraintEntry(
                    name = rs.getString("constraint_name"),
                    type = rs.getString("constraint_type"),
                    searchCondition = rs.getString("search_condition"),
                    enabled = rs.getBoolean("status"),
                    invalid = rs.getBoolean("invalid"),
                    columnName = rs.getString("column_name"),
                    referencedConstraintName = rs.getString("ref_constraint_name"),
                    referencedTableName = rs.getString("ref_table_name"),
                    referencedColumnName = rs.getString("ref_column_name"),
                )
            )
        }

        return entries
            .groupBy({ it.first }, { it.second })
            .mapValues {
                it.value
                    .groupBy { entry -> entry.name }
                    .map { entry -> mapToConstraint(entry.value) }
            }
    }

    private fun mapToConstraint(constraintEntries: List<ConstraintEntry>): ConstraintMetadata =
        constraintEntries.first().run {
            when (type) {
                "P" -> PrimaryKeyConstraintMetadata(
                    name = name,
                    columnNames = constraintEntries.map { it.columnName },
                    enabled = enabled,
                    invalid = invalid,
                )

                "R" -> ForeignKeyConstraintMetadata(
                    name = name,
                    enabled = enabled,
                    invalid = invalid,
                    referencedConstraintName = referencedConstraintName
                        ?: throw IllegalArgumentException("Missing referenced constraint name for foreign key constraint '$name'!"),
                    referencedTableName = referencedTableName
                        ?: throw IllegalArgumentException("Missing referenced table name for foreign key constraint '$name'!"),
                    references = constraintEntries.map {
                        ForeignKeyConstraintMetadata.ColumnReference(
                            columnName = it.columnName,
                            referencedColumnName = it.referencedColumnName
                                ?: throw IllegalArgumentException("Missing referenced column name for foreign key constraint '$name'!"),
                        )
                    }
                )

                "U" -> UniqueConstraintMetadata(
                    name = name,
                    columnNames = constraintEntries.map { it.columnName },
                    invalid = invalid,
                    enabled = enabled,
                )

                "C" -> CheckConstraintMetadata(
                    name = name,
                    columnNames = constraintEntries.map { it.columnName },
                    enabled = enabled,
                    invalid = invalid,
                    condition = searchCondition
                        ?: throw IllegalArgumentException("Missing search condition for check constraint '$name'!"),
                )

                else -> throw IllegalArgumentException("Unsupported Oracle constraint type: '$type'!")
            }
        }

    private companion object {
        private val GET_CONSTRAINTS_SQL_QUERY = """
            SELECT con.table_name, con.constraint_name, con.constraint_type, con.search_condition, DECODE(con.status, 'ENABLED', 1, 0) as status, DECODE(con.INVALID, 'INVALID', 1, 0) as invalid,
                col.column_name, con.r_constraint_name ref_constraint_name, ref_col.table_name ref_table_name, ref_col.column_name ref_column_name
            FROM user_constraints con
                LEFT JOIN user_cons_columns col ON con.constraint_name = col.constraint_name
                LEFT JOIN user_cons_columns ref_col ON con.r_constraint_name = ref_col.constraint_name
                    AND col.position = ref_col.position
            WHERE con.table_name IN (:table_names) AND con.constraint_type IN ('P', 'R', 'U', 'C')
            ORDER BY DECODE(con.constraint_type, 'P', 1, 'R', 2, 'U', 3, 'C', 4, 5), con.constraint_name
        """.trimIndent()
    }

}

private data class ConstraintEntry(
    val name: String,
    val type: String,
    val searchCondition: String?,
    val enabled: Boolean,
    val invalid: Boolean,
    val columnName: String,
    val referencedConstraintName: String?,
    val referencedTableName: String?,
    val referencedColumnName: String?,
)
