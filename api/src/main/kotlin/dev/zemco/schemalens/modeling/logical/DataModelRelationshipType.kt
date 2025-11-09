package dev.zemco.schemalens.modeling.logical

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

enum class DataModelRelationshipType {
    ONE_TO_ONE,
    ONE_TO_MANY,
}

fun DataModelRelationshipType.mapToCharacter(): Char = when (this) {
    DataModelRelationshipType.ONE_TO_ONE -> '1'
    DataModelRelationshipType.ONE_TO_MANY -> 'N'
}

fun Char.mapToDataModelRelationshipType(): DataModelRelationshipType = when (this) {
    '1' -> DataModelRelationshipType.ONE_TO_ONE
    'N' -> DataModelRelationshipType.ONE_TO_MANY
    else -> throw IllegalArgumentException("Invalid relationship type '$this'")
}

@Converter
class DataModelRelationshipTypeConverter : AttributeConverter<DataModelRelationshipType, Char> {

    override fun convertToDatabaseColumn(attribute: DataModelRelationshipType?): Char? =
        attribute?.mapToCharacter()

    override fun convertToEntityAttribute(dbData: Char?): DataModelRelationshipType? =
        dbData?.mapToDataModelRelationshipType()

}
