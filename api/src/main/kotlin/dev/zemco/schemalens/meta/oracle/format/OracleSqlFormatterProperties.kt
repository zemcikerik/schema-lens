package dev.zemco.schemalens.meta.oracle.format

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "oracle.format")
data class OracleSqlFormatterProperties(
    val apiBaseUrl: String? = null,
)
