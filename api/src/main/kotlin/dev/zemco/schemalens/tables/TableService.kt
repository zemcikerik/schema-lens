package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.projects.Project

interface TableService {
    fun getTableList(project: Project): List<String>
    fun getTableDetails(project: Project, tableName: String): TableMetadata?
}