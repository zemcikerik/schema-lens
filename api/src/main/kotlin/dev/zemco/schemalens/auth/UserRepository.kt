package dev.zemco.schemalens.auth

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, Long> {
    @Query("SELECT CASE WHEN EXISTS (SELECT 'X' FROM dev.zemco.schemalens.auth.User WHERE LOWER(username) = LOWER(:username)) THEN TRUE ELSE FALSE END")
    fun existsByUsernameIgnoreCase(username: String): Boolean

    @Query("SELECT CASE WHEN EXISTS (SELECT 'X' FROM dev.zemco.schemalens.auth.User WHERE LOWER(email) = LOWER(:email)) THEN TRUE ELSE FALSE END")
    fun existsByEmailIgnoreCase(email: String): Boolean

    @Query("SELECT u FROM dev.zemco.schemalens.auth.User u WHERE LOWER(u.username) = LOWER(:username)")
    fun findByUsernameIgnoreCase(username: String): User?
}
