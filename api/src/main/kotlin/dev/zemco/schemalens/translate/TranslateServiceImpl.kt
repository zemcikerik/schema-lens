package dev.zemco.schemalens.translate

import org.springframework.stereotype.Service

@Service
class TranslateServiceImpl(
    private val translateConfiguration: TranslateConfiguration,
    private val rawTranslationLoader: RawTranslationLoader
) : TranslateService {

    override fun getRawTranslations(locale: Locale): String? =
        if (translateConfiguration.allowedLocales.contains(locale)) {
            rawTranslationLoader.loadRawTranslations(locale)
        } else {
            null
        }

}
