package dev.zemco.schemalens.locale

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import org.springframework.stereotype.Component

@Component
class LocaleDeserializer : JsonDeserializer<Locale>() {

    override fun deserialize(parser: JsonParser, context: DeserializationContext?): Locale =
        parseLocale(parser.text)

}
