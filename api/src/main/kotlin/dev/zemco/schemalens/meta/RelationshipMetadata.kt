package dev.zemco.schemalens.meta

data class RelationshipMetadata(
    val parentName: String,
    val childName: String,
    val references: List<ColumnReference>,
    val identifying: Boolean,
    val mandatory: Boolean,
    val unique: Boolean,
) {
    data class ColumnReference(
        val parentColumnName: String,
        val childColumnName: String,
    )
}
