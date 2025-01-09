package dev.zemco.schemalens.auth

interface UserService {
    fun changePassword(user: User, oldPassword: String, newPassword: String): Boolean
    fun deleteUser(user: User)
    fun getCurrentUser(): User
    fun getUserByUsername(username: String): User?
    fun loginUser(username: String, password: String): User?
    fun registerUser(registrationDto: UserRegistrationDto): User
    fun saveUser(user: User): User
}
