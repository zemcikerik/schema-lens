package dev.zemco.schemalens.auth

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserServiceImpl(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
) : UserService {

    override fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw IllegalStateException("User is not authenticated")

        return (authentication.principal as UserWrapperDetails).user
    }

    override fun getUserByUsername(username: String): User? =
        userRepository.findByUsernameIgnoreCase(username)

    override fun loginUser(username: String, password: String): User? {
        val user = userRepository.findByUsernameIgnoreCase(username) ?: return null

        if (!passwordEncoder.matches(password, user.password)) {
            throw WrongPasswordException()
        }

        return user
    }

    override fun registerUser(registrationDto: UserRegistrationDto): User {
        if (userRepository.existsByUsernameIgnoreCase(registrationDto.username)) {
            throw UsernameIsTakenException()
        }
        if (userRepository.existsByEmailIgnoreCase(registrationDto.email)) {
            throw EmailIsTakenException()
        }

        return userRepository.save(User(
            username = registrationDto.username,
            email = registrationDto.email,
            password = passwordEncoder.encode(registrationDto.password),
        ))
    }
}
