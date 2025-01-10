package dev.zemco.schemalens.help

import jakarta.persistence.AttributeConverter
import org.springframework.core.convert.converter.Converter
import org.springframework.stereotype.Component
import jakarta.persistence.Converter as ConverterAttribute

@Component
@ConverterAttribute
class LocaleConverter : Converter<String, Locale>, AttributeConverter<Locale, String> {

    override fun convert(rawLocale: String): Locale =
        parseLocale(rawLocale)

    override fun convertToDatabaseColumn(locale: Locale?): String? =
        locale?.toString()

    override fun convertToEntityAttribute(rawLocale: String?): Locale? =
        rawLocale?.let { parseLocale(it) }

}
