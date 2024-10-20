package dev.zemco.schemalens.translate

import org.springframework.boot.context.properties.ConfigurationPropertiesBinding
import org.springframework.core.convert.converter.Converter
import org.springframework.stereotype.Component

@Component
@ConfigurationPropertiesBinding
class LocaleConverter : Converter<String, Locale> {
    override fun convert(source: String): Locale = parseLocale(source)
}
