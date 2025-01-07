package dev.zemco.schemalens.auth

class ResourceAccessDeniedException(message: String = "Forbidden") : RuntimeException(message)

class UsernameIsTakenException(message: String = "Username is taken by another user") : RuntimeException(message)
class EmailIsTakenException(message: String = "Email is taken by another user") : RuntimeException(message)
class WrongPasswordException(message: String = "Wrong password") : RuntimeException(message)
