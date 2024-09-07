package dev.zemco.schemalens.translate

import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import java.nio.file.Files

@Component
class FileRawTranslationLoader(
    val translateConfiguration: TranslateConfiguration
) : RawTranslationLoader {
    @Cacheable(cacheNames = ["raw-translations"], key = "#locale")
    override fun loadRawTranslations(locale: Locale): String {
        val path = translateConfiguration.basePath.resolve("$locale.json")
        return Files.readString(path)
    }
}
