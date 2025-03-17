package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.models.options.SetColumnUnusedOptions
import dev.zemco.schemalens.meta.oracle.format.OracleSqlFormatter
import dev.zemco.schemalens.meta.spi.TableColumnMetadataWriter
import dev.zemco.schemalens.meta.toJdbcTemplate
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
@Qualifier("oracle")
class OracleTableColumnMetadataWriter(
    private val oracleSqlFormatter: OracleSqlFormatter,
) : TableColumnMetadataWriter {

    override fun areUnusedColumnsSupported(datasource: DataSource): Boolean = true

    override fun previewColumnUnused(datasource: DataSource, options: SetColumnUnusedOptions): String =
        generateDdlForUnusedColumn(options).let { oracleSqlFormatter.formatSql("$it;") }

    override fun setColumnUnused(datasource: DataSource, options: SetColumnUnusedOptions) =
        datasource.toJdbcTemplate().execute(generateDdlForUnusedColumn(options))

    private fun generateDdlForUnusedColumn(options: SetColumnUnusedOptions): String {
        if (options.tableName.contains("\"") || options.columnName.contains("\"")) {
            throw IllegalArgumentException("Identifier cannot contain '\"' character.")
        }

        return StringBuilder().apply {
            append("ALTER TABLE \"")
            append(options.tableName)
            append("\" SET UNUSED COLUMN \"")
            append(options.columnName)
            append("\"")

            if (options.cascadeConstraints) {
                append(" CASCADE CONSTRAINTS")
            }
        }.toString()
    }

}
