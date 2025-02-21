package dev.zemco.schemalens.auth

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.security.config.annotation.web.invoke
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpMethod.POST
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(JwtConfiguration::class)
class SecurityConfiguration {

    @Bean
    fun filterChain(
        http: HttpSecurity,
        jwtTokenFilter: JwtTokenFilter,
        jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint
    ): SecurityFilterChain {
        http {
            cors { }
            csrf { disable() }
            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.STATELESS
            }
            exceptionHandling {
                authenticationEntryPoint = jwtAuthenticationEntryPoint
            }
            authorizeRequests {
                authorize(GET, "/actuator/health/**", permitAll)
                authorize(POST, "/user", permitAll)
                authorize(POST, "/user/login", permitAll)
                authorize(POST, "/user/login/refresh", permitAll)
                authorize(GET, "/help/faq/*", permitAll)
                authorize("/admin/**", hasAuthority(Role.ADMIN.toString()))
                authorize(anyRequest, authenticated)
            }
            addFilterBefore<UsernamePasswordAuthenticationFilter>(jwtTokenFilter)
            httpBasic { disable() }
        }
        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder =
        BCryptPasswordEncoder(10)

}
