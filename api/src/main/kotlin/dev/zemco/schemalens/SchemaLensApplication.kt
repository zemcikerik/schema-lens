package dev.zemco.schemalens

import dev.zemco.schemalens.translate.TranslateConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.transaction.annotation.EnableTransactionManagement

@EnableCaching
@EnableConfigurationProperties(TranslateConfiguration::class)
@EnableTransactionManagement
@SpringBootApplication
class SchemaLensApplication

fun main(args: Array<String>) {
	runApplication<SchemaLensApplication>(*args)
}
