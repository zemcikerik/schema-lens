package dev.zemco.schemalens.profile

import org.springframework.stereotype.Component
import java.awt.Image
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream
import javax.imageio.ImageIO
import kotlin.math.floor
import kotlin.math.min

@Component
class ProfilePictureConverterImpl(
    private val profilePictureConfiguration: ProfilePictureConfiguration
) : ProfilePictureConverter {

    override fun convertToPngWithCorrectResolution(stream: InputStream): ByteArray {
        val image = ImageIO.read(stream) ?: throw IOException("Could not read image")
        val (width, height) = computeDimensions(image.width, image.height)

        val rescaledImage = image.getScaledInstance(width, height, Image.SCALE_SMOOTH)
        val outputImage = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)
        outputImage.graphics.drawImage(rescaledImage, 0, 0, width, height, null)

        return ByteArrayOutputStream().use {
            ImageIO.write(outputImage, "png", it)
            it.toByteArray()
        }
    }

    private fun computeDimensions(width: Int, height: Int): Pair<Int, Int> {
        if (width == 0 || height == 0) {
            throw IOException("Profile picture has to have positive width and height")
        }

        val widthRatio = profilePictureConfiguration.maximumWidth.toFloat() / width.toFloat()
        val heightRatio = profilePictureConfiguration.maximumHeight.toFloat() / height.toFloat()
        val scale = min(widthRatio, heightRatio)
        val scaledWidth = floor(width * scale).toInt()
        val scaledHeight = floor(height * scale).toInt()
        return scaledWidth to scaledHeight
    }

}
