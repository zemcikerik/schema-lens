package dev.zemco.schemalens.auth

import org.springframework.security.access.AccessDeniedException

class ResourceAccessDeniedException(message: String = "Forbidden") : AccessDeniedException(message)

class UsernameIsTakenException(message: String = "Username is taken by another user") : RuntimeException(message)
class EmailIsTakenException(message: String = "Email is taken by another user") : RuntimeException(message)
class WrongPasswordException(message: String = "Wrong password") : RuntimeException(message)
