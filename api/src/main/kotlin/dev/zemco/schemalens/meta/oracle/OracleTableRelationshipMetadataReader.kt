package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.spi.TableRelationshipMetadataReader
import dev.zemco.schemalens.meta.toNamedJdbcTemplate
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
@Qualifier("oracle")
class OracleTableRelationshipMetadataReader : TableRelationshipMetadataReader {

    override fun readDependantTableNamesOnTableColumn(dataSource: DataSource, tableName: String, columnName: String): List<String> {
        val params = MapSqlParameterSource(mapOf(
            "table_name" to tableName,
            "column_name" to columnName,
        ))

        return dataSource.toNamedJdbcTemplate().queryForList(GET_DEPENDANT_ON_COLUMN_QUERY, params, String::class.java)
    }

    fun readDirectlyRelatedTableNames(dataSource: DataSource, tableNames: Set<String>): List<String> {
        val params = MapSqlParameterSource("table_names", tableNames)
        return dataSource.toNamedJdbcTemplate().queryForList(GET_DIRECT_RELATIONSHIPS_QUERY, params, String::class.java)
    }

    companion object {
        private val GET_DEPENDANT_ON_COLUMN_QUERY = """
            SELECT DISTINCT con.table_name
            FROM user_constraints con
                INNER JOIN user_constraints ref_con ON (con.r_constraint_name = ref_con.constraint_name)
                INNER JOIN user_cons_columns con_cols ON (con.r_constraint_name = con_cols.constraint_name)
            WHERE con.constraint_type = 'R' AND ref_con.table_name = :table_name AND con_cols.column_name = :column_name
        """.trimIndent()

        private val GET_DIRECT_RELATIONSHIPS_QUERY = """
            WITH source_table_fk AS (
                SELECT table_name, r_constraint_name
                FROM all_constraints
                WHERE owner = user AND r_owner = user AND constraint_type = 'R'
            ), target_table_pk AS (
                SELECT table_name, constraint_name
                FROM all_constraints
                WHERE owner = user AND constraint_type = 'P'
            ), relationships AS (
                SELECT fk.table_name AS source_table_name, pk.table_name AS target_table_name
                FROM source_table_fk fk
                    INNER JOIN target_table_pk pk ON (fk.r_constraint_name = pk.constraint_name)
                WHERE pk.table_name IN (:table_names) OR fk.table_name in (:table_names)
            )
            SELECT source_table_name FROM relationships
            UNION
            SELECT target_table_name FROM relationships
        """.trimIndent()
    }

}
