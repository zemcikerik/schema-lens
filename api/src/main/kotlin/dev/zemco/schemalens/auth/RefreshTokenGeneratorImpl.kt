package dev.zemco.schemalens.auth

import org.springframework.stereotype.Component
import java.security.SecureRandom
import java.util.Base64

@Component
class RefreshTokenGeneratorImpl : RefreshTokenGenerator {

    private val rng = SecureRandom()

    override fun generateRefreshToken(): String {
        // we need 32 characters
        // https://stackoverflow.com/a/17864767
        val bytes = ByteArray(24)
        rng.nextBytes(bytes)
        return Base64.getEncoder().encodeToString(bytes)
    }

}
