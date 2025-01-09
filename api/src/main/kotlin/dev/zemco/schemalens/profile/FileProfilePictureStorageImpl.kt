package dev.zemco.schemalens.profile

import org.springframework.stereotype.Component

@Component
class FileProfilePictureStorageImpl(
    private val profilePictureConfiguration: ProfilePictureConfiguration,
) : ProfilePictureStorage {

    override fun saveProfilePicture(username: String, pngBytes: ByteArray) =
        profilePictureConfiguration.folderPath
            .resolve("$username.png")
            .toFile()
            .writeBytes(pngBytes)

}
