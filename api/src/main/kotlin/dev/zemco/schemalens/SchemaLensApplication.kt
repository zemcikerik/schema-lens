package dev.zemco.schemalens

import dev.zemco.schemalens.locale.LocaleConfiguration
import dev.zemco.schemalens.profile.ProfilePictureConfiguration
import dev.zemco.schemalens.projects.ProjectConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.transaction.annotation.EnableTransactionManagement

@EnableConfigurationProperties(value = [
	LocaleConfiguration::class,
	ProfilePictureConfiguration::class,
	ProjectConfiguration::class,
])
@EnableTransactionManagement
@SpringBootApplication
class SchemaLensApplication

fun main(args: Array<String>) {
	runApplication<SchemaLensApplication>(*args)
}
