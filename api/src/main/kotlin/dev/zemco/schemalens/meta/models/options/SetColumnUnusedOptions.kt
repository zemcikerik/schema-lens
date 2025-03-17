package dev.zemco.schemalens.meta.models.options

data class SetColumnUnusedOptions(
    val tableName: String,
    val columnName: String,
    val cascadeConstraints: Boolean,
)
