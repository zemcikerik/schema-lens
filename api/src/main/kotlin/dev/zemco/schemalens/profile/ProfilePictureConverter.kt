package dev.zemco.schemalens.profile

import java.io.InputStream

interface ProfilePictureConverter {
    fun convertToPngWithCorrectResolution(stream: InputStream): ByteArray
}
