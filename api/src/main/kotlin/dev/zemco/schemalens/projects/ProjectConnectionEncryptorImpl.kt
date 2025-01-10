package dev.zemco.schemalens.projects

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.security.SecureRandom
import java.util.*
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

@Component
class ProjectConnectionEncryptorImpl(
    projectConfiguration: ProjectConfiguration
) : ProjectConnectionEncryptor {

    private val rng = SecureRandom()
    private val key = projectConfiguration.passwordEncryptionKey?.let { decodeEncryptionKey(it) }
        ?: generateEncryptionKey()

    override fun encryptPassword(password: String): String {
        val initializationVectorBytes = ByteArray(INITIALIZATION_VECTOR_SIZE).also { rng.nextBytes(it) }
        val initializationVector = IvParameterSpec(initializationVectorBytes)

        val encryptedBytes = Cipher.getInstance(CIPHER_ALGORITHM)
            .also { it.init(Cipher.ENCRYPT_MODE, key, initializationVector) }
            .doFinal(password.toByteArray())

        val finalBytes = ByteArray(INITIALIZATION_VECTOR_SIZE + encryptedBytes.size)
        System.arraycopy(initializationVectorBytes, 0, finalBytes, 0, INITIALIZATION_VECTOR_SIZE)
        System.arraycopy(encryptedBytes, 0, finalBytes, INITIALIZATION_VECTOR_SIZE, encryptedBytes.size)

        return Base64.getEncoder().encodeToString(finalBytes)
    }

    override fun decryptPassword(password: String): String {
        val passwordBytes = Base64.getDecoder().decode(password)
        val initializationVector = IvParameterSpec(passwordBytes, 0, INITIALIZATION_VECTOR_SIZE)

        val decryptedBytes = Cipher.getInstance(CIPHER_ALGORITHM)
            .also { it.init(Cipher.DECRYPT_MODE, key, initializationVector) }
            .doFinal(passwordBytes, INITIALIZATION_VECTOR_SIZE, passwordBytes.size - INITIALIZATION_VECTOR_SIZE)

        return String(decryptedBytes)
    }

    private fun decodeEncryptionKey(rawKey: String): SecretKey =
        Base64.getDecoder().decode(rawKey).let {
            if (it.size != AES_BITS / 8) {
                throw IllegalArgumentException("Secret key must have $AES_BITS bits")
            }
            SecretKeySpec(it, 0, it.size, SECRET_KEY_ALGORITHM)
        }

    private fun generateEncryptionKey(): SecretKey {
        LOGGER.warn("Generating password encryption key because none was provided!")
        val key = KeyGenerator.getInstance(SECRET_KEY_ALGORITHM)
            .apply { init(AES_BITS) }
            .generateKey()

        val encodedKey = Base64.getEncoder().encodeToString(key.encoded)
        LOGGER.info("Using generated password encryption key: {}", encodedKey)

        return key
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(ProjectConnectionEncryptorImpl::class.java)
        private const val SECRET_KEY_ALGORITHM = "AES"
        private const val CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding"
        private const val AES_BITS = 256
        private const val INITIALIZATION_VECTOR_SIZE = 16
    }

}
