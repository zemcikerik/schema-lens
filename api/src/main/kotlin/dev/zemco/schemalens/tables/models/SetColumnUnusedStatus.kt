package dev.zemco.schemalens.tables.models

data class SetColumnUnusedStatus(
    val available: Boolean,
    val cascadeConstraintsRequired: Boolean,
    val referencedByTables: List<String>,
    val usedInMultiColumnConstraints: List<String>,
) {
    companion object {
        val UNAVAILABLE = SetColumnUnusedStatus(
            available = false,
            cascadeConstraintsRequired = false,
            referencedByTables = emptyList(),
            usedInMultiColumnConstraints = emptyList()
        )
    }
}
