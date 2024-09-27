package dev.zemco.schemalens.translate

interface TranslateService {
    fun getRawTranslations(locale: Locale): String?
}
