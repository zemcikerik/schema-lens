package dev.zemco.schemalens.auth

import org.springframework.stereotype.Component
import java.security.SecureRandom
import java.util.Base64
import java.util.concurrent.atomic.AtomicInteger

@Component
class RefreshTokenGeneratorImpl : RefreshTokenGenerator {

    private val rng = SecureRandom()
    private val generationCount = AtomicInteger()

    override fun generateRefreshToken(): String {
        // we need 32 characters
        // https://stackoverflow.com/a/17864767
        val bytes = ByteArray(24)
        rng.nextBytes(bytes)

        // reseed after 5 generated tokens
        if (this.generationCount.incrementAndGet() == 5) {
            rng.reseed()
            this.generationCount.set(0)
        }

        return Base64.getEncoder().encodeToString(bytes)
    }

}
