package dev.zemco.schemalens

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SchemaLensApplication

fun main(args: Array<String>) {
	runApplication<SchemaLensApplication>(*args)
}
