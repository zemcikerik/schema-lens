package dev.zemco.schemalens

import dev.zemco.schemalens.translate.TranslateConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@EnableCaching
@EnableConfigurationProperties(TranslateConfiguration::class)
@SpringBootApplication
class SchemaLensApplication

fun main(args: Array<String>) {
	runApplication<SchemaLensApplication>(*args)
}
