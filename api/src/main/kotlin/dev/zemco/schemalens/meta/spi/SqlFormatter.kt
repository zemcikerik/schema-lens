package dev.zemco.schemalens.meta.spi

fun interface SqlFormatter {
    fun formatSql(sql: String): String
}
