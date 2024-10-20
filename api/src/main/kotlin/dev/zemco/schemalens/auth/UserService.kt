package dev.zemco.schemalens.auth

interface UserService {
    fun getCurrentUser(): User
}
