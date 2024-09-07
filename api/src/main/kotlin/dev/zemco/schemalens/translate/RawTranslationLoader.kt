package dev.zemco.schemalens.translate

fun interface RawTranslationLoader {
    fun loadRawTranslations(locale: Locale): String
}
