package dev.zemco.schemalens.auth

import jakarta.validation.Valid
import org.hibernate.validator.constraints.Length
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService,
    private val jwtService: JwtService,
    private val refreshTokenService: RefreshTokenService,
) {

    @GetMapping
    fun currentUser(): UserDto =
        userService.getCurrentUser().mapToDto()

    @PostMapping("/login")
    fun login(@RequestBody @Valid loginDto: UserLoginDto): ResponseEntity<Any> {
        try {
            val user = userService.loginUser(loginDto.username, loginDto.password)
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

            return ResponseEntity.ok().addJwtTokenFor(user).body(user.mapToDto())
        } catch (ex: WrongPasswordException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }
    }

    @PostMapping
    fun register(@RequestBody @Valid registrationDto: UserRegistrationDto): ResponseEntity<Any> {
        try {
            val user = userService.registerUser(registrationDto)
            return ResponseEntity.ok().addJwtTokenFor(user).body(user.mapToDto())
        } catch (ex: UsernameIsTakenException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(UserRegistrationFailure.USERNAME_TAKEN)
        } catch (ex: EmailIsTakenException) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(UserRegistrationFailure.EMAIL_TAKEN)
        }
    }

    @PostMapping("/login/refresh")
    fun refresh(@RequestBody @Length(min = 32, max = 32) token: String): ResponseEntity<Any> {
        val user = refreshTokenService.useRefreshToken(token)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok().addJwtTokenFor(user).build()
    }

    @PutMapping
    fun updateUser(@RequestBody @Valid updateUserDto: UpdateUserDto): ResponseEntity<UserDto> {
        val user = userService.getCurrentUser()
        user.email = updateUserDto.email
        return ResponseEntity.ok(userService.saveUser(user).mapToDto())
    }

    @PutMapping("/password")
    fun changePassword(@RequestBody @Valid changePasswordDto: ChangePasswordDto): ResponseEntity<Any> {
        val user = userService.getCurrentUser()
        val (oldPassword, newPassword) = changePasswordDto

        return if (userService.changePassword(user, oldPassword, newPassword))
            ResponseEntity.noContent().build()
            else ResponseEntity.status(HttpStatus.FORBIDDEN).build()
    }

    private fun ResponseEntity.BodyBuilder.addJwtTokenFor(user: User): ResponseEntity.BodyBuilder =
        header("Authorization", "Bearer ${jwtService.createJwtFor(user)}")

    private fun User.mapToDto(): UserDto =
        UserDto(
            username = username,
            email = email,
        )

}
