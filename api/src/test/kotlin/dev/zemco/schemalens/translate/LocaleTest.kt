package dev.zemco.schemalens.translate

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class LocaleTest {

    @Test
    fun `given valid locale in string when parseLocale called then locale should be parsed`() {
        assertEquals(Locale("en", "US"), parseLocale("en_US"))
        assertEquals(Locale("de", "DE"), parseLocale("de_DE"))
        assertEquals(Locale("sk", "SK"), parseLocale("sk_SK"))
    }

    @Test
    fun `given invalid locale in string when parseLocale called then exception should be thrown`() {
        assertThrows(IllegalArgumentException::class.java) { parseLocale("en_USA") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("EN_US") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("US_en") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("skSK") }
        assertThrows(IllegalArgumentException::class.java) { parseLocale("sk") }
    }

    @Test
    fun `given parsed locale when toString called then locale should be formatted`() {
        assertEquals("en_US", Locale("en", "US").toString())
        assertEquals("de_DE", Locale("de", "DE").toString())
        assertEquals("sk_SK", Locale("sk", "SK").toString())
    }

}
