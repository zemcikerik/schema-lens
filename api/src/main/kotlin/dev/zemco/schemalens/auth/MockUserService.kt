package dev.zemco.schemalens.auth

import org.springframework.stereotype.Service

@Service
class MockUserService : UserService {
    override fun getCurrentUser(): User = User()
}
