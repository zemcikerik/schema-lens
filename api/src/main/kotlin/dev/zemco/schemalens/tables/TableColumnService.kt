package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.models.options.SetColumnUnusedOptions
import dev.zemco.schemalens.projects.Project
import dev.zemco.schemalens.tables.models.SetColumnUnusedStatus

interface TableColumnService {
    fun getColumnUnusedAvailability(project: Project, tableName: String, columnName: String): SetColumnUnusedStatus?
    fun previewSqlForSetColumnUnused(project: Project, options: SetColumnUnusedOptions): String?
    fun setColumnUnused(project: Project, options: SetColumnUnusedOptions): Boolean
}
