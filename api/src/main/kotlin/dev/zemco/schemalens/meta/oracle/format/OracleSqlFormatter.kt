package dev.zemco.schemalens.meta.oracle.format

fun interface OracleSqlFormatter {
    fun formatSql(sql: String): String
}
