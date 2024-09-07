package dev.zemco.schemalens.translate

fun interface TranslateService {
    fun getRawTranslations(locale: Locale): String?
}
