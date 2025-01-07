package dev.zemco.schemalens.auth

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwt")
data class JwtConfiguration(
    @field:NotBlank
    val issuer: String = "schema-lens",

    @field:Min(1)
    val expirationMinutes: Long = 60 * 12,

    val signingKey: String? = null,
)
