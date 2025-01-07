package dev.zemco.schemalens.auth

import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, Long> {
    fun existsByUsernameIgnoreCase(username: String): Boolean
    fun existsByEmailIgnoreCase(email: String): Boolean

    fun findByUsernameIgnoreCase(username: String): User?
}
