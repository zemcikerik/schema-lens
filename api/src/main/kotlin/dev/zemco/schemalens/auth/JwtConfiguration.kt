package dev.zemco.schemalens.auth

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwt")
data class JwtConfiguration(
    @field:NotBlank
    val issuer: String = "schema-lens",

    @field:Min(1)
    val expirationMinutes: Long = 10,

    @field:Min(1)
    val refreshTokenExpirationMinutes: Long = 60 * 24 * 3,

    @field:NotBlank
    val authoritiesClaimName: String = "roles",

    @field:NotBlank
    val refreshTokenClaimName: String = "refresh_token",

    val signingKey: String? = null,
)
