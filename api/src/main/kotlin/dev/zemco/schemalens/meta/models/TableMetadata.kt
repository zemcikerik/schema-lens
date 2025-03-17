package dev.zemco.schemalens.meta.models

data class TableMetadata(
    val name: String,
    val columns: List<ColumnMetadata>,
    val constraints: List<ConstraintMetadata>,
    val indexes: List<IndexMetadata>,
)
