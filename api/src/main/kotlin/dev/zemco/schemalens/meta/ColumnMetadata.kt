package dev.zemco.schemalens.meta

data class ColumnMetadata(
    val name: String,
    val type: String,
    val nullable: Boolean,
)
