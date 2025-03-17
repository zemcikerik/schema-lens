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

    fun readDirectlyRelatedTableNames(dataSource: DataSource, tableName: String): List<String> {
        val params = MapSqlParameterSource("table_name", tableName)
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
            SELECT DISTINCT
                DECODE(con.table_name, :table_name, ref_con.table_name, con.table_name) as table_name
            FROM user_constraints con
                INNER JOIN user_constraints ref_con ON (con.r_constraint_name = ref_con.constraint_name)
            WHERE con.constraint_type = 'R' AND :table_name IN (con.table_name, ref_con.table_name)
        """.trimIndent()
    }

}