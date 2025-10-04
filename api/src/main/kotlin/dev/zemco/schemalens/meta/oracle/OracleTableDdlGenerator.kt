package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.spi.TableDdlGenerator
import dev.zemco.schemalens.meta.toJdbcTemplate
import org.springframework.stereotype.Component
import java.sql.Connection
import java.sql.Types
import javax.sql.DataSource

@Component
class OracleTableDdlGenerator : TableDdlGenerator {

    override fun generateDdlForTable(dataSource: DataSource, tableName: String): String {
        return dataSource.toJdbcTemplate().execute { connection: Connection ->
            connection.prepareCall(GENERATE_DDL_SQL).run {
                setString(2, tableName)
                registerOutParameter(1, Types.VARCHAR)
                execute()
                getString(1)
            }
        } ?: throw IllegalArgumentException("Failed to generate DDL for table '$tableName'")
    }

    private companion object {
        private val GENERATE_DDL_SQL = """
            BEGIN
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'COLLATION_CLAUSE', 'NEVER');
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'PRETTY', TRUE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'SQLTERMINATOR', TRUE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'CONSTRAINTS', TRUE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'REF_CONSTRAINTS', TRUE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'CONSTRAINTS_AS_ALTER', TRUE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'OID', FALSE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'SIZE_BYTE_KEYWORD', FALSE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'PARTITIONING', TRUE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'SEGMENT_ATTRIBUTES', FALSE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'STORAGE', FALSE);
                DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM, 'TABLESPACE', FALSE);
            
                ? := DBMS_METADATA.GET_DDL('TABLE', ?);
            END;
        """.trimIndent()
    }

}
