package dev.zemco.schemalens.meta.models

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(value = [
    JsonSubTypes.Type(value = PrimaryKeyConstraintMetadata::class, name = "PRIMARY_KEY"),
    JsonSubTypes.Type(value = ForeignKeyConstraintMetadata::class, name = "FOREIGN_KEY"),
    JsonSubTypes.Type(value = UniqueConstraintMetadata::class, name = "UNIQUE"),
    JsonSubTypes.Type(value = CheckConstraintMetadata::class, name = "CHECK"),
])
abstract class ConstraintMetadata {
    abstract val name: String
    abstract val columnNames: List<String>
    abstract val enabled: Boolean
    abstract val invalid: Boolean
}

data class PrimaryKeyConstraintMetadata(
    override val name: String,
    override val columnNames: List<String>,
    override val enabled: Boolean,
    override val invalid: Boolean,
): ConstraintMetadata()

data class ForeignKeyConstraintMetadata(
    override val name: String,
    override val enabled: Boolean,
    override val invalid: Boolean,
    val referencedConstraintName: String,
    val referencedTableName: String,
    val references: List<ColumnReference>,
): ConstraintMetadata() {
    override val columnNames: List<String>
        get() = references.map { it.columnName }

    data class ColumnReference(
        val columnName: String,
        val referencedColumnName: String,
    )
}

data class UniqueConstraintMetadata(
    override val name: String,
    override val columnNames: List<String>,
    override val enabled: Boolean,
    override val invalid: Boolean,
): ConstraintMetadata()

data class CheckConstraintMetadata(
    override val name: String,
    override val columnNames: List<String>,
    override val enabled: Boolean,
    override val invalid: Boolean,
    val condition: String,
): ConstraintMetadata()
