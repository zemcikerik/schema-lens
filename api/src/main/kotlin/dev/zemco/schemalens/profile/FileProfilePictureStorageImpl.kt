package dev.zemco.schemalens.profile

import org.springframework.stereotype.Component
import java.io.IOException
import java.nio.file.Path

@Component
class FileProfilePictureStorageImpl(
    private val profilePictureConfiguration: ProfilePictureConfiguration,
) : ProfilePictureStorage {

    override fun deleteProfilePicture(username: String) {
        val file = getPathFor(username).toFile()
        if (file.exists() && !file.delete()) {
            throw IOException("Could not delete profile picture for user '$username'")
        }
    }

    override fun saveProfilePicture(username: String, pngBytes: ByteArray) =
        getPathFor(username).toFile().writeBytes(pngBytes)

    private fun getPathFor(username: String): Path =
        profilePictureConfiguration.folderPath.resolve("$username.png")

}
