package dev.zemco.schemalens.meta

data class TableRelationshipsMetadata(
    val tables: List<TableMetadata>,
    val relationships: List<RelationshipMetadata>,
)
