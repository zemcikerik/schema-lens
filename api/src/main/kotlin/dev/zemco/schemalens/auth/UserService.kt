package dev.zemco.schemalens.auth

interface UserService {
    fun getCurrentUser(): User
    fun getUserByUsername(username: String): User?
    fun loginUser(username: String, password: String): User?
    fun registerUser(registrationDto: UserRegistrationDto): User
}
