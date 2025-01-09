package dev.zemco.schemalens.profile

import org.slf4j.LoggerFactory
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service
import java.io.IOException

@Service
class ProfilePictureServiceImpl(
    private val profilePictureConverter: ProfilePictureConverter,
    private val profilePictureStorage: ProfilePictureStorage,
) : ProfilePictureService {

    override fun saveProfilePicture(username: String, resource: Resource): Boolean {
        val pngBytes = try {
            resource.inputStream.use {
                profilePictureConverter.convertToPngWithCorrectResolution(it)
            }
        } catch (ex: IOException) {
            LOGGER.error("Failed to save profile picture for user '$username'", ex)
            return false
        }

        profilePictureStorage.saveProfilePicture(username, pngBytes)
        return true
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(ProfilePictureServiceImpl::class.java)
    }

}