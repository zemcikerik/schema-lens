package dev.zemco.schemalens.meta.oracle

data class OracleTableRelationship(
    val tableName: String,
    val type: RelationshipType
) {
    enum class RelationshipType {
        PARENT,
        CHILD,
    }
}
