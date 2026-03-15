package dev.zemco.schemalens.modeling.edges

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

enum class DataModelEdgeType(private val apiValue: String) {
    ONE_TO_ONE("1:1"),
    ONE_TO_MANY("1:N");

    @JsonValue
    fun toApiValue(): String = apiValue

    companion object {
        @JsonCreator
        @JvmStatic
        fun fromApiValue(value: String): DataModelEdgeType =
            entries.find { it.apiValue == value }
                ?: throw IllegalArgumentException("Unknown edge type: '$value'")
    }
}

fun DataModelEdgeType.mapToCharacter(): Char = when (this) {
    DataModelEdgeType.ONE_TO_ONE -> '1'
    DataModelEdgeType.ONE_TO_MANY -> 'N'
}

fun Char.mapToDataModelEdgeType(): DataModelEdgeType = when (this) {
    '1' -> DataModelEdgeType.ONE_TO_ONE
    'N' -> DataModelEdgeType.ONE_TO_MANY
    else -> throw IllegalArgumentException("Invalid edge type '$this'")
}

@Converter
class DataModelEdgeTypeConverter : AttributeConverter<DataModelEdgeType, Char> {

    override fun convertToDatabaseColumn(attribute: DataModelEdgeType?): Char? =
        attribute?.mapToCharacter()

    override fun convertToEntityAttribute(dbData: Char?): DataModelEdgeType? =
        dbData?.mapToDataModelEdgeType()

}
