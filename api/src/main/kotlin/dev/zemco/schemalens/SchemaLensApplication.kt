package dev.zemco.schemalens

import dev.zemco.schemalens.profile.ProfilePictureConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.transaction.annotation.EnableTransactionManagement

@EnableCaching
@EnableConfigurationProperties(value = [
	ProfilePictureConfiguration::class,
])
@EnableTransactionManagement
@SpringBootApplication
class SchemaLensApplication

fun main(args: Array<String>) {
	runApplication<SchemaLensApplication>(*args)
}
