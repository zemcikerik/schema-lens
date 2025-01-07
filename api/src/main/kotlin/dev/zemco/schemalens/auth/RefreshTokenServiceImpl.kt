package dev.zemco.schemalens.auth

import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class RefreshTokenServiceImpl(
    private val refreshTokenRepository: RefreshTokenRepository,
    private val refreshTokenGenerator: RefreshTokenGenerator,
    private val jwtConfiguration: JwtConfiguration,
) : RefreshTokenService {

    override fun createRefreshTokenFor(user: User): String {
        val token = refreshTokenGenerator.generateRefreshToken()

        refreshTokenRepository.save(RefreshTokenEntry(
            token = token,
            userId = user.id!!,
            user = user,
            expiresAt = createExpirationDate()
        ))

        return token
    }

    override fun useRefreshToken(token: String): User? {
        val entry = refreshTokenRepository.findByToken(token) ?: return null

        if (LocalDateTime.now() > entry.expiresAt) {
            return null
        }

        refreshTokenRepository.delete(entry)
        return entry.user!!
    }

    private fun createExpirationDate(): LocalDateTime =
        LocalDateTime.now().plusMinutes(jwtConfiguration.refreshTokenExpirationMinutes)

}