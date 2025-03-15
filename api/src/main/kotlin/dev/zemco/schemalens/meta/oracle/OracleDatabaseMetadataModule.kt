package dev.zemco.schemalens.meta.oracle

import dev.zemco.schemalens.meta.spi.DatabaseMetadataModule
import dev.zemco.schemalens.meta.spi.TableDdlGenerator
import dev.zemco.schemalens.meta.spi.TableMetadataReader
import dev.zemco.schemalens.meta.spi.TableRelationshipResolver
import dev.zemco.schemalens.projects.OracleProjectConnectionInfo
import dev.zemco.schemalens.projects.ProjectConnectionInfo
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Component
class OracleDatabaseMetadataModule(
    private val tableMetadataReader: OracleTableMetadataReader,
    private val tableDdlGenerator: OracleTableDdlGenerator,
    private val tableRelationshipResolver: OracleTableRelationshipResolver,
) : DatabaseMetadataModule {

    override fun canResolveFor(connectionInfo: ProjectConnectionInfo): Boolean =
        connectionInfo is OracleProjectConnectionInfo

    @Suppress("UNCHECKED_CAST")
    override fun <T : Any> resolve(connectionInfo: ProjectConnectionInfo, target: KClass<T>): T? =
        when (target) {
            TableMetadataReader::class -> tableMetadataReader as T
            TableDdlGenerator::class -> tableDdlGenerator as T
            TableRelationshipResolver::class -> tableRelationshipResolver as T
            else -> null
        }

}