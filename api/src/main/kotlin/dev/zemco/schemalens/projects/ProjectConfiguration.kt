package dev.zemco.schemalens.projects

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "project")
data class ProjectConfiguration(
    val passwordEncryptionKey: String? = null,
)
