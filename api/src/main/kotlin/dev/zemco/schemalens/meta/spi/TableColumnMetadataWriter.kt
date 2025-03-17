package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.meta.models.options.SetColumnUnusedOptions
import javax.sql.DataSource

interface TableColumnMetadataWriter {
    fun areUnusedColumnsSupported(datasource: DataSource): Boolean
    fun previewColumnUnused(datasource: DataSource, options: SetColumnUnusedOptions): String
    fun setColumnUnused(datasource: DataSource, options: SetColumnUnusedOptions)
}
