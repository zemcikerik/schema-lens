package dev.zemco.schemalens.backup

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import java.time.Clock
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Configuration
class BackupTaskExecutorConfiguration {

    @Bean(destroyMethod = "shutdown")
    fun backupTaskExecutor(): ExecutorService =
        Executors.newSingleThreadExecutor { runnable ->
            Thread(runnable, "backup-0").apply {
                isDaemon = true
            }
        }

    @Bean
    fun backupTaskScheduler(): TaskScheduler =
        ThreadPoolTaskScheduler().apply {
            poolSize = 1
            clock = Clock.systemUTC()
            setThreadNamePrefix("backup-schedule-")
            initialize()
        }
}
