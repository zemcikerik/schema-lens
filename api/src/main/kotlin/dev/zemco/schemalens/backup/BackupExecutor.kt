package dev.zemco.schemalens.backup

import org.springframework.core.io.Resource

interface BackupExecutor {
    fun dumpSchema(directoryName: String, dumpFileName: String, logFileName: String, jobName: String)
    fun cleanupInterruptedJob(jobName: String): Boolean = false
    fun getFileSize(directoryName: String, fileName: String): Long?
    fun getFile(directoryName: String, fileName: String): Resource?
    fun deleteFileIfExists(directoryName: String, fileName: String): Boolean
}
