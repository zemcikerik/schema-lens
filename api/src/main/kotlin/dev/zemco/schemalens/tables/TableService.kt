package dev.zemco.schemalens.tables

import dev.zemco.schemalens.meta.TableMetadata
import dev.zemco.schemalens.meta.TableRelationshipsMetadata
import dev.zemco.schemalens.projects.Project

interface TableService {
    fun getTableList(project: Project): List<String>
    fun getTableDetails(project: Project, tableName: String): TableMetadata?
    fun getRelatedTableDetails(project: Project, tableName: String): TableRelationshipsMetadata?
    fun generateDdlForTable(project: Project, tableName: String): String?
}
