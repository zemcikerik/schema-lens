package dev.zemco.schemalens.auth

import org.springframework.security.core.GrantedAuthority

data class RoleGrantedAuthority(val role: Role) : GrantedAuthority {
    override fun getAuthority(): String = role.toString()
}
