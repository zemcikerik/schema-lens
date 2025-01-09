package dev.zemco.schemalens.profile

interface ProfilePictureStorage {
    fun saveProfilePicture(username: String, pngBytes: ByteArray)
}
