package dev.zemco.schemalens.meta.models

data class TableRelationshipsMetadata(
    val tables: List<TableMetadata>,
    val relationships: List<RelationshipMetadata>,
)
