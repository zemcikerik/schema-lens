package dev.zemco.schemalens.backup

import org.springframework.core.io.Resource
import org.slf4j.LoggerFactory
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class DataPumpBackupExecutor(
    private val jdbcTemplate: JdbcTemplate,
    private val dataSource: DataSource,
) : BackupExecutor {

    override fun dumpSchema(directoryName: String, dumpFileName: String, logFileName: String, jobName: String) {
        LOGGER.info(
            "Starting Oracle Data Pump export jobName='{}', directoryName='{}', dumpFileName='{}', logFileName='{}'",
            jobName,
            directoryName,
            dumpFileName,
            logFileName,
        )

        jdbcTemplate.update(
            EXPORT_SCHEMA_SQL,
            jobName,
            dumpFileName,
            directoryName,
            logFileName,
            directoryName,
        )

        LOGGER.info("Finished Oracle Data Pump export jobName='{}'", jobName)
    }

    override fun cleanupInterruptedJob(jobName: String): Boolean {
        if (!dataPumpJobExists(jobName)) {
            LOGGER.info("Skipped cleanup for missing Oracle Data Pump jobName='{}'", jobName)
            return false
        }

        jdbcTemplate.update(STOP_JOB_SQL, jobName)
        LOGGER.info("Stopped interrupted Oracle Data Pump jobName='{}'", jobName)
        return true
    }

    override fun getFileSize(directoryName: String, fileName: String): Long? =
        oracleDirectoryFiles(directoryName).size(fileName)

    override fun getFile(directoryName: String, fileName: String): Resource? =
        oracleDirectoryFiles(directoryName).resource(fileName)

    override fun deleteFileIfExists(directoryName: String, fileName: String): Boolean =
        oracleDirectoryFiles(directoryName).deleteIfExists(fileName)

    private fun oracleDirectoryFiles(directoryName: String): OracleDirectoryFiles =
        OracleDirectoryFiles(directoryName, jdbcTemplate, dataSource)

    private fun dataPumpJobExists(jobName: String): Boolean =
        (jdbcTemplate.queryForObject(DATA_PUMP_JOB_EXISTS_SQL, Int::class.java, jobName) ?: 0) > 0

    companion object {
        private val LOGGER = LoggerFactory.getLogger(DataPumpBackupExecutor::class.java)
        private const val DATA_PUMP_JOB_EXISTS_SQL = "SELECT COUNT(*) FROM USER_DATAPUMP_JOBS WHERE JOB_NAME = ?"

        private val EXPORT_SCHEMA_SQL = $$"""
            DECLARE
              v_handle NUMBER;
              v_job_state VARCHAR2(128);
            BEGIN
              v_handle := DBMS_DATAPUMP.OPEN(
                operation => 'EXPORT',
                job_mode => 'SCHEMA',
                job_name => ?
              );

              DBMS_DATAPUMP.ADD_FILE(
                handle => v_handle,
                filename => ?,
                directory => ?,
                filetype => DBMS_DATAPUMP.KU$_FILE_TYPE_DUMP_FILE,
                reusefile => 0
              );
              DBMS_DATAPUMP.ADD_FILE(
                handle => v_handle,
                filename => ?,
                directory => ?,
                filetype => DBMS_DATAPUMP.KU$_FILE_TYPE_LOG_FILE,
                reusefile => 0
              );

              DBMS_DATAPUMP.METADATA_FILTER(
                handle => v_handle,
                name => 'SCHEMA_EXPR',
                value => 'IN (''' || USER || ''')'
              );

              DBMS_DATAPUMP.SET_PARAMETER(
                handle => v_handle,
                name => 'FLASHBACK_TIME',
                value => 'SYSTIMESTAMP'
              );

              DBMS_DATAPUMP.SET_PARAMETER(
                handle => v_handle,
                name => 'COMPRESSION',
                value => 'METADATA_ONLY'
              );

              DBMS_DATAPUMP.START_JOB(v_handle);
              DBMS_DATAPUMP.WAIT_FOR_JOB(v_handle, v_job_state);
              DBMS_DATAPUMP.DETACH(v_handle);
            EXCEPTION
              WHEN OTHERS THEN
                IF v_handle IS NOT NULL THEN
                  BEGIN
                    DBMS_DATAPUMP.DETACH(v_handle);
                  EXCEPTION
                    WHEN OTHERS THEN NULL;
                  END;
                END IF;
                RAISE;
            END;
            """.trimIndent()

        private val STOP_JOB_SQL = $$"""
            DECLARE
              v_handle NUMBER;
            BEGIN
              v_handle := DBMS_DATAPUMP.ATTACH(job_name => ?);
              DBMS_DATAPUMP.STOP_JOB(v_handle, 1, 0);
            EXCEPTION
              WHEN OTHERS THEN
                IF v_handle IS NOT NULL THEN
                  BEGIN
                    DBMS_DATAPUMP.DETACH(v_handle);
                  EXCEPTION
                    WHEN OTHERS THEN NULL;
                  END;
                END IF;

                IF SQLCODE <> -31626 THEN
                  RAISE;
                END IF;
            END;
            """.trimIndent()
    }
}
