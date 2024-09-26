package dev.zemco.schemalens.translate

import org.springframework.stereotype.Service

@Service
class TranslateServiceImpl(
    val translateConfiguration: TranslateConfiguration,
    val rawTranslationLoader: RawTranslationLoader
) : TranslateService {

    override fun getRawTranslations(locale: Locale): String? =
        if (translateConfiguration.allowedLocales.contains(locale)) {
            rawTranslationLoader.loadRawTranslations(locale)
        } else {
            null
        }

}
