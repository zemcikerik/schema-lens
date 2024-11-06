package dev.zemco.schemalens.meta

data class ColumnMetadata(
    val name: String,
    val position: Int,
    val type: String,
    val nullable: Boolean,
)
