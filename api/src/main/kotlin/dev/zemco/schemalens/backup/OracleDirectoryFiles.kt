package dev.zemco.schemalens.backup

import org.slf4j.LoggerFactory
import org.springframework.core.io.AbstractResource
import org.springframework.core.io.Resource
import org.springframework.dao.DataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.queryForObject
import org.springframework.jdbc.datasource.DataSourceUtils
import java.io.FilterInputStream
import java.io.InputStream
import java.sql.Blob
import java.sql.CallableStatement
import java.sql.Connection
import java.sql.Types
import javax.sql.DataSource

class OracleDirectoryFiles(
    private val directoryName: String,
    private val jdbcTemplate: JdbcTemplate,
    private val dataSource: DataSource,
) {
    fun size(fileName: String): Long? =
        if (exists(fileName)) {
            jdbcTemplate.queryForObject<Long>(FILE_SIZE_SQL, directoryName, fileName)
        } else {
            null
        }

    fun resource(fileName: String): Resource? {
        val fileSize = size(fileName) ?: return null
        return OracleDirectoryFileResource(dataSource, directoryName, fileName, fileSize)
    }

    fun deleteIfExists(fileName: String): Boolean {
        if (!exists(fileName)) {
            LOGGER.debug("Skipped deleting missing Oracle directory file directoryName='{}', fileName='{}'", directoryName, fileName)
            return false
        }

        jdbcTemplate.update(DELETE_FILE_SQL, directoryName, fileName)
        LOGGER.debug("Deleted Oracle directory file directoryName='{}', fileName='{}'", directoryName, fileName)
        return true
    }

    private fun exists(fileName: String): Boolean =
        try {
            jdbcTemplate.queryForObject<Int>(
                FILE_EXISTS_SQL,
                directoryName,
                fileName,
            ) == 1
        } catch (ex: DataAccessException) {
            LOGGER.error("Failed to check Oracle directory file existence directoryName='{}', fileName='{}'", directoryName, fileName, ex)
            false
        }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(OracleDirectoryFiles::class.java)

        private const val FILE_EXISTS_SQL = "SELECT DBMS_LOB.FILEEXISTS(BFILENAME(?, ?)) FROM DUAL"
        private const val FILE_SIZE_SQL = "SELECT DBMS_LOB.GETLENGTH(BFILENAME(?, ?)) FROM DUAL"
        private const val DELETE_FILE_SQL = "BEGIN UTL_FILE.FREMOVE(?, ?); END;"
    }
}

private class OracleDirectoryFileResource(
    private val dataSource: DataSource,
    private val directoryName: String,
    private val fileName: String,
    private val fileSize: Long,
) : AbstractResource() {

    override fun getDescription(): String =
        "Oracle directory file '$directoryName/$fileName'"

    override fun getFilename(): String = fileName

    override fun exists(): Boolean = true

    override fun contentLength(): Long = fileSize

    override fun getInputStream(): InputStream {
        var connection: Connection? = null
        var statement: CallableStatement? = null
        var blob: Blob? = null

        try {
            connection = DataSourceUtils.getConnection(dataSource)
            statement = connection.prepareCall(READ_FILE_SQL).apply {
                setString(1, directoryName)
                setString(2, fileName)
                registerOutParameter(3, Types.BLOB)
            }

            statement.execute()
            blob = statement.getBlob(3)

            return OracleDirectoryFileInputStream(
                delegate = blob.binaryStream,
                blob = blob,
                statement = statement,
                connection = connection,
                dataSource = dataSource,
            )
        } catch (ex: Exception) {
            blob?.free()
            statement?.close()
            connection?.let { DataSourceUtils.releaseConnection(it, dataSource) }
            throw ex
        }
    }

    private companion object {
        private val READ_FILE_SQL = """
            DECLARE
              v_file BFILE;
              v_blob BLOB;
              v_length INTEGER;
            BEGIN
              v_file := BFILENAME(?, ?);
              DBMS_LOB.FILEOPEN(v_file, DBMS_LOB.FILE_READONLY);
              v_length := DBMS_LOB.GETLENGTH(v_file);
              DBMS_LOB.CREATETEMPORARY(v_blob, FALSE, DBMS_LOB.SESSION);
              DBMS_LOB.LOADFROMFILE(v_blob, v_file, v_length);
              DBMS_LOB.FILECLOSE(v_file);
              ? := v_blob;
            EXCEPTION
              WHEN OTHERS THEN
                IF DBMS_LOB.FILEISOPEN(v_file) = 1 THEN
                  DBMS_LOB.FILECLOSE(v_file);
                END IF;
                RAISE;
            END;
            """.trimIndent()
    }
}

private class OracleDirectoryFileInputStream(
    delegate: InputStream,
    private val blob: Blob,
    private val statement: CallableStatement,
    private val connection: Connection,
    private val dataSource: DataSource,
) : FilterInputStream(delegate) {

    override fun close() {
        try {
            super.close()
        } finally {
            blob.free()
            statement.close()
            DataSourceUtils.releaseConnection(connection, dataSource)
        }
    }
}
