package dev.zemco.schemalens.projects

import javax.sql.DataSource

interface ProjectConnectionService {
    fun <T> withDataSource(connectionInfo: ProjectConnectionInfo, function: (DataSource) -> T): T
}
