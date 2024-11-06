package dev.zemco.schemalens.meta

data class TableMetadata(
    val name: String,
    val columns: List<ColumnMetadata>,
    val constraints: List<ConstraintMetadata>,
)
