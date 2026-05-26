package dev.zemco.schemalens

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Converter(autoApply = true)
class UtcInstantAttributeConverter : AttributeConverter<Instant, LocalDateTime> {

    override fun convertToDatabaseColumn(attribute: Instant?): LocalDateTime? =
        attribute?.atOffset(ZoneOffset.UTC)?.toLocalDateTime()

    override fun convertToEntityAttribute(dbData: LocalDateTime?): Instant? =
        dbData?.toInstant(ZoneOffset.UTC)
}