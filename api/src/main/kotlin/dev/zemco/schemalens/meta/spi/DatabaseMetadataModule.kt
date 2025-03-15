package dev.zemco.schemalens.meta.spi

import dev.zemco.schemalens.projects.ProjectConnectionInfo
import kotlin.reflect.KClass

interface DatabaseMetadataModule {
    fun canResolveFor(connectionInfo: ProjectConnectionInfo): Boolean
    fun <T : Any> resolve(connectionInfo: ProjectConnectionInfo, target: KClass<T>): T?
}
