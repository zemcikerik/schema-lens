package dev.zemco.schemalens.translate

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class TranslateServiceImplTest {

    @MockK
    private lateinit var translateConfiguration: TranslateConfiguration

    @MockK
    private lateinit var rawTranslationLoader: RawTranslationLoader

    @InjectMockKs
    private lateinit var translateService: TranslateServiceImpl

    @Test
    fun `when getRawTranslations called with allowed locale, then raw translations should be loaded`() {
        val enUsLocale = Locale(language = "en", country = "US")
        every { translateConfiguration.allowedLocales } returns listOf(enUsLocale)

        val rawTranslations = "{\"KEY\": \"Value!\"}"
        every { rawTranslationLoader.loadRawTranslations(enUsLocale) } returns rawTranslations

        assertEquals(rawTranslations, translateService.getRawTranslations(enUsLocale))
    }

    @Test
    fun `when getRawTranslations called with disallowed locale, then raw translations should not be loaded`() {
        every { translateConfiguration.allowedLocales } returns emptyList()
        assertNull(translateService.getRawTranslations(Locale(language = "pl", country = "PL")))
        verify(exactly = 0) { rawTranslationLoader.loadRawTranslations(any()) }
    }

}
