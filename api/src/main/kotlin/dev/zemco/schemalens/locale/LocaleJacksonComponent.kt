package dev.zemco.schemalens.locale

import org.springframework.boot.jackson.JacksonComponent
import tools.jackson.core.JsonGenerator
import tools.jackson.core.JsonParser
import tools.jackson.databind.DeserializationContext
import tools.jackson.databind.SerializationContext
import tools.jackson.databind.ValueDeserializer
import tools.jackson.databind.ValueSerializer

@JacksonComponent
class LocaleJacksonComponent {

    class Serializer : ValueSerializer<Locale>() {
        override fun serialize(value: Locale, generator: JsonGenerator, ctx: SerializationContext?) {
            generator.writeString(value.toString())
        }
    }

    class Deserializer : ValueDeserializer<Locale>() {
        override fun deserialize(parser: JsonParser, ctx: DeserializationContext?): Locale =
            parseLocale(parser.string)
    }

}
