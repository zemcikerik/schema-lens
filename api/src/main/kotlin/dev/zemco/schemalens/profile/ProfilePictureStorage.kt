package dev.zemco.schemalens.profile

interface ProfilePictureStorage {
    fun deleteProfilePicture(username: String)
    fun saveProfilePicture(username: String, pngBytes: ByteArray)
}
