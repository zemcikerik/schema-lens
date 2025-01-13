package dev.zemco.schemalens.locale

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize

@JsonSerialize(using = LocaleSerializer::class)
@JsonDeserialize(using = LocaleDeserializer::class)
data class Locale(
    val language: String,
    val country: String,
) {
    override fun toString(): String = "${language}_${country}"
}

fun parseLocale(rawLocale: String): Locale =
    if (isRawLocaleInvalid(rawLocale)) {
        throw IllegalArgumentException("Locale must be in a format xx_XX!")
    } else {
        Locale(rawLocale.substring(0, 2), rawLocale.substring(3))
    }

// examples of correct locales: en_US, sk_SK, de_DE, en_GB
private fun isRawLocaleInvalid(rawLocale: String): Boolean {
    if (rawLocale.length != 5) {
        return true
    }
    if (rawLocale[2] != '_') {
        return true
    }
    if (!rawLocale[0].isLowerCase() || !rawLocale[1].isLowerCase()) {
        return true
    }
    if (!rawLocale[3].isUpperCase() || !rawLocale[4].isUpperCase()) {
        return true
    }
    return false
}
