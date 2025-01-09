package dev.zemco.schemalens.profile

import org.springframework.core.io.Resource

interface ProfilePictureService {
    fun removeProfilePicture(username: String)
    fun saveProfilePicture(username: String, resource: Resource): Boolean
}
