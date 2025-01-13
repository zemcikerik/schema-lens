package dev.zemco.schemalens.locale

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import org.springframework.stereotype.Component

@Component
class LocaleSerializer : JsonSerializer<Locale>() {

    override fun serialize(value: Locale, generator: JsonGenerator, serializers: SerializerProvider?) =
        generator.writeString(value.toString())

}
