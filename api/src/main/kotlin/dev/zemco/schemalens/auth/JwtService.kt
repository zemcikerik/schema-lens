package dev.zemco.schemalens.auth

import org.springframework.security.core.Authentication

interface JwtService {
    fun createJwtFor(user: User): String
    fun createAuthenticationFrom(jwt: String): Authentication
}
