package dev.zemco.schemalens.meta

data class RelatedTablesMetadata(
    val parents: List<TableMetadata>,
    val children: List<TableMetadata>,
)
