package dev.zemco.schemalens.projects

import javax.sql.DataSource

interface ProjectConnectionService {
    fun asDataSource(connectionInfo: ProjectConnectionInfo): DataSource
    fun <T> withDataSource(connectionInfo: ProjectConnectionInfo, function: (DataSource) -> T): T
}
