package dev.zemco.schemalens.auth

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserWrapperDetails(val user: User) : UserDetails {

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = mutableListOf()
    override fun getUsername(): String = user.username
    override fun getPassword(): String = user.password

}
