package dev.zemco.schemalens.auth

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
    private val userService: UserService,
) : UserDetailsService {

    override fun loadUserByUsername(username: String?): UserDetails =
        username?.let { userService.getUserByUsername(it) }?.let { UserWrapperDetails(it) }
            ?: throw UsernameNotFoundException("User with username '$username' not found")

}
