package dev.zemco.schemalens.meta

data class RelationshipMetadata(
    val parentName: String,
    val childName: String,
    val identifying: Boolean,
    val mandatory: Boolean,
    val unique: Boolean,
)
