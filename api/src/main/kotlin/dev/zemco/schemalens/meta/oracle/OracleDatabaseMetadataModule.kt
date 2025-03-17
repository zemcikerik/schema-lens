package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.spi.*
import dev.zemco.schemalens.projects.OracleProjectConnectionInfo
import dev.zemco.schemalens.projects.ProjectConnectionInfo
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Component
class OracleDatabaseMetadataModule(
    private val tableMetadataReader: OracleTableMetadataReader,
    private val tableColumnMetadataReader: OracleTableColumnMetadataReader,
    private val tableColumnMetadataWriter: OracleTableColumnMetadataWriter,
    private val tableConstraintMetadataReader: OracleTableConstraintMetadataReader,
    private val tableDdlGenerator: OracleTableDdlGenerator,
    private val tableRelationshipMetadataReader: OracleTableRelationshipMetadataReader,
    private val tableRelationshipResolver: OracleTableRelationshipResolver,
) : DatabaseMetadataModule {

    override fun canResolveFor(connectionInfo: ProjectConnectionInfo): Boolean =
        connectionInfo is OracleProjectConnectionInfo

    @Suppress("UNCHECKED_CAST")
    override fun <T : Any> resolve(connectionInfo: ProjectConnectionInfo, target: KClass<T>): T? =
        when (target) {
            TableMetadataReader::class -> tableMetadataReader as T
            TableColumnMetadataReader::class -> tableColumnMetadataReader as T
            TableColumnMetadataWriter::class -> tableColumnMetadataWriter as T
            TableConstraintMetadataReader::class -> tableConstraintMetadataReader as T
            TableDdlGenerator::class -> tableDdlGenerator as T
            TableRelationshipMetadataReader::class -> tableRelationshipMetadataReader as T
            TableRelationshipResolver::class -> tableRelationshipResolver as T
            else -> null
        }

}