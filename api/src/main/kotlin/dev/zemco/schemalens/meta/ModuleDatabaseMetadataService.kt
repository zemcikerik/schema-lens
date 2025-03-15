package dev.zemco.schemalens.meta

import dev.zemco.schemalens.meta.spi.DatabaseMetadataModule
import dev.zemco.schemalens.projects.ProjectConnectionInfo
import org.springframework.stereotype.Service
import kotlin.reflect.KClass

@Service
class ModuleDatabaseMetadataService(
    private val metadataModules: List<DatabaseMetadataModule>,
) : DatabaseMetadataService {

    override fun <T : Any> getForConnection(connectionInfo: ProjectConnectionInfo, target: KClass<T>): T =
        metadataModules.asSequence()
            .filter { it.canResolveFor(connectionInfo) }
            .map { it.resolve(connectionInfo, target) }
            .filterNotNull()
            .firstOrNull() ?: throw IllegalStateException("Failed to resolve $target for ${connectionInfo.javaClass}")

}
