package dev.zemco.schemalens.projects

import org.apache.commons.validator.routines.InetAddressValidator
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.dao.DataAccessException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.PermissionDeniedDataAccessException
import org.springframework.dao.QueryTimeoutException
import org.springframework.jdbc.CannotGetJdbcConnectionException
import org.springframework.jdbc.datasource.SimpleDriverDataSource
import org.springframework.stereotype.Component
import java.sql.SQLException
import javax.sql.DataSource

@Component
class ProjectConnectionServiceImpl : ProjectConnectionService {

    override fun asDataSource(connectionInfo: ProjectConnectionInfo): DataSource =
        when (connectionInfo) {
            is OracleProjectConnectionInfo -> asDataSource(connectionInfo)
            else -> throw UnsupportedOperationException("Unsupported connection type")
        }

    private fun asDataSource(connectionInfo: OracleProjectConnectionInfo): DataSource =
        connectionInfo.run {
            DataSourceBuilder.create()
                .url("jdbc:oracle:thin:@${escapeHost(host)}:$port/$service")
                .username(username)
                .password(password)
                .type(SimpleDriverDataSource::class.java)
                .build()
        }

    override fun <T> withDataSource(connectionInfo: ProjectConnectionInfo, function: (DataSource) -> T): T =
        try {
            function(asDataSource(connectionInfo))
        } catch (ex: DataAccessException) {
            throw ProjectConnectionException(mapExceptionToFailureStatus(ex), extractSqlExceptionMessage(ex)?.trim(), ex)
        }

    private fun mapExceptionToFailureStatus(ex: DataAccessException) =
        when (ex) {
            is CannotGetJdbcConnectionException -> ProjectConnectionFailure.CONNECTION_FAILURE
            is QueryTimeoutException -> ProjectConnectionFailure.TIMEOUT
            is DataIntegrityViolationException -> ProjectConnectionFailure.INTEGRITY_VIOLATION
            is PermissionDeniedDataAccessException -> ProjectConnectionFailure.PERMISSION_DENIED
            else -> ProjectConnectionFailure.UNKNOWN
        }

    private fun extractSqlExceptionMessage(ex: Throwable?): String? =
        if (ex == null) null else ((ex as? SQLException)?.message ?: extractSqlExceptionMessage(ex.cause))

    private fun escapeHost(host: String): String =
        if (IP_VALIDATOR.isValidInet6Address(host)) "[$host]" else host

    private companion object {
        private val IP_VALIDATOR = InetAddressValidator.getInstance()
    }

}
