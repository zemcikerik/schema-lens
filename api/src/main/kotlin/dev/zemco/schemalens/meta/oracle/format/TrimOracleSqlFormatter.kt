package dev.zemco.schemalens.meta.oracle.format

class TrimOracleSqlFormatter : OracleSqlFormatter {

    override fun formatSql(sql: String): String =
        sql.trimIndent()

}
