package dev.zemco.schemalens.auth

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.io.Encoders
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*
import javax.crypto.SecretKey

@Service
class JwtServiceImpl(
    private val jwtConfiguration: JwtConfiguration,
    private val userDetailsService: UserDetailsService,
    private val refreshTokenService: RefreshTokenService,
) : JwtService {

    private val signingKey: SecretKey = jwtConfiguration.signingKey?.let { decodeKey(it) } ?: generateKey()

    override fun createJwtFor(user: User): String =
        Jwts.builder()
            .signWith(signingKey)
            .issuer(jwtConfiguration.issuer)
            .subject(user.username)
            .expiration(createExpirationDate())
            .claim(jwtConfiguration.refreshTokenClaimName, refreshTokenService.createRefreshTokenFor(user))
            .compact()

    override fun createAuthenticationFrom(jwt: String): Authentication =
        Jwts.parser()
            .verifyWith(signingKey)
            .requireIssuer(jwtConfiguration.issuer)
            .build()
            .parseSignedClaims(jwt)
            .payload
            .subject
            .let { userDetailsService.loadUserByUsername(it) }
            .let { UsernamePasswordAuthenticationToken(it, null, it.authorities) }

    private fun createExpirationDate(): Date {
        val dateTime = LocalDateTime.now().plusMinutes(jwtConfiguration.expirationMinutes)
        return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant())
    }

    private fun decodeKey(base64EncodedKey: String): SecretKey {
        val bytes = Decoders.BASE64.decode(base64EncodedKey)
        return Keys.hmacShaKeyFor(bytes)
    }

    private fun generateKey(): SecretKey {
        LOGGER.warn("Generating signing key because none was provided!")
        val key = Jwts.SIG.HS512.key().build()

        val encodedKey = Encoders.BASE64.encode(key.encoded)
        LOGGER.info("Using generated key: {}", encodedKey)

        return key
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(JwtServiceImpl::class.java)
    }

}
