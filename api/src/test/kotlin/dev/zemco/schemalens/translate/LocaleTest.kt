package dev.zemco.schemalens.translate

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class LocaleTest {

    @Test
    fun `when parseLocale called with valid locale, then locale should be parsed`() {
        assertEquals(Locale("en", "US"), parseLocale("en_US"))
        assertEquals(Locale("de", "DE"), parseLocale("de_DE"))
        assertEquals(Locale("sk", "SK"), parseLocale("sk_SK"))
    }

    @Test
    fun `when parseLocale called with invalid locale, then exception should be thrown`() {
        assertThrows(IllegalArgumentException::class.java) { parseLocale("en_USA") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("EN_US") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("US_en") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("skSK") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("sk") }
    }

    @Test
    fun `when toString called, then locale should be formatted`() {
        assertEquals("en_US", Locale("en", "US").toString())
        assertEquals("de_DE", Locale("de", "DE").toString())
        assertEquals("sk_SK", Locale("sk", "SK").toString())
    }

}
