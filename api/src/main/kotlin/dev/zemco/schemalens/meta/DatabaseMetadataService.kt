package dev.zemco.schemalens.meta

import dev.zemco.schemalens.projects.ProjectConnectionInfo
import kotlin.reflect.KClass

interface DatabaseMetadataService {
    fun <T : Any> getForConnection(connectionInfo: ProjectConnectionInfo, target: KClass<T>): T
}

inline fun <reified T : Any> DatabaseMetadataService.getForConnection(connectionInfo: ProjectConnectionInfo): T =
    getForConnection(connectionInfo, T::class)
