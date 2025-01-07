package dev.zemco.schemalens.auth

interface RefreshTokenGenerator {
    fun generateRefreshToken(): String
}
