package dev.zemco.schemalens.auth

import org.springframework.data.repository.CrudRepository

interface RefreshTokenRepository : CrudRepository<RefreshTokenEntry, Long> {
    fun findByToken(token: String): RefreshTokenEntry?
}
