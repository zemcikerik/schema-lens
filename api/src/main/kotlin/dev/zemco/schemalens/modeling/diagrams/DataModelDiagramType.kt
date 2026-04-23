package dev.zemco.schemalens.modeling.diagrams

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

enum class DataModelDiagramType(private val apiValue: String) {
    LOGICAL("logical"),
    ORACLE("oracle");

    @JsonValue
    fun toApiValue(): String = apiValue

    companion object {
        @JsonCreator
        @JvmStatic
        fun fromApiValue(value: String): DataModelDiagramType =
            entries.find { it.apiValue == value.lowercase() }
                ?: throw IllegalArgumentException("Unknown diagram type: '$value'")
    }
}

fun DataModelDiagramType.mapToCharacter(): Char = when (this) {
    DataModelDiagramType.LOGICAL -> 'L'
    DataModelDiagramType.ORACLE -> 'O'
}

fun Char.mapToDataModelDiagramType(): DataModelDiagramType = when (this) {
    'L' -> DataModelDiagramType.LOGICAL
    'O' -> DataModelDiagramType.ORACLE
    else -> throw IllegalArgumentException("Invalid diagram type '$this'")
}

@Converter
class DataModelDiagramTypeConverter : AttributeConverter<DataModelDiagramType, Char> {

    override fun convertToDatabaseColumn(attribute: DataModelDiagramType?): Char? =
        attribute?.mapToCharacter()

    override fun convertToEntityAttribute(dbData: Char?): DataModelDiagramType? =
        dbData?.mapToDataModelDiagramType()

}
