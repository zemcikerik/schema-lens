package dev.zemco.schemalens.meta.spi

import javax.sql.DataSource

interface TableDdlGenerator {
    fun generateDdlForTable(dataSource: DataSource, tableName: String): String?
}
