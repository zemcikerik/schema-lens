package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.TableMetadataReader
import dev.zemco.schemalens.meta.toJdbcTemplate
import javax.sql.DataSource

class OracleTableMetadataReader : TableMetadataReader {

    override fun readTableList(dataSource: DataSource): List<String> =
        dataSource.toJdbcTemplate().query("SELECT table_name FROM user_tables", { rs, _ ->
            rs.getString("table_name")
        })

    override fun readTableDetails(dataSource: DataSource, tableName: String) {
        TODO("Not yet implemented")
    }

}
