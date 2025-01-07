package dev.zemco.schemalens.auth

interface RefreshTokenService {
    fun createRefreshTokenFor(user: User): String
    fun useRefreshToken(token: String): User?
}
