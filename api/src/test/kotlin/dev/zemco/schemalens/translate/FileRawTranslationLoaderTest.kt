package dev.zemco.schemalens.translate

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import java.io.IOException
import java.nio.file.Path
import kotlin.io.path.createFile
import kotlin.io.path.writeText

class FileRawTranslationLoaderTest {

    @Test
    fun `when loadRawTranslations called with valid locale, then raw translations should be loaded`(
        @TempDir basePath: Path
    ) {
        val rawTranslations = "{\"TEST\": \"Hello, World!\"}"
        basePath.resolve("en_US.json").createFile().writeText(rawTranslations)
        val configuration = mockConfigurationWith(basePath)

        val loader = FileRawTranslationLoader(configuration)
        val result = loader.loadRawTranslations(Locale(language = "en", country = "US"))

        assertEquals(rawTranslations, result)
    }

    @Test
    fun `when loadRawTranslations called with invalid locale, then exception should be thrown`(
        @TempDir basePath: Path
    ) {
        val configuration = mockConfigurationWith(basePath)
        val loader = FileRawTranslationLoader(configuration)
        assertThrows(IOException::class.java) { loader.loadRawTranslations(Locale(language = "aa", country = "AA")) }
    }

    private fun mockConfigurationWith(basePath: Path): TranslateConfiguration =
        mockk<TranslateConfiguration>().also { every { it.basePath } returns basePath }

}
