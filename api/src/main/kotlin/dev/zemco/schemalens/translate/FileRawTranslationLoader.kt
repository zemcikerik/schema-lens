package dev.zemco.schemalens.translate

import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import kotlin.io.path.readText

@Component
class FileRawTranslationLoader(
    private val translateConfiguration: TranslateConfiguration
) : RawTranslationLoader {

    @Cacheable(cacheNames = ["raw-translations"], key = "#locale")
    override fun loadRawTranslations(locale: Locale): String =
        translateConfiguration.basePath.resolve("$locale.json").readText()

}
