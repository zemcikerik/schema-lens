package dev.zemco.schemalens.meta.models

data class IndexMetadata(
    val name: String,
    val type: IndexType,
    val unique: Boolean,
    val compressed: Boolean,
    val logged: Boolean,
    val columns: List<IndexColumn>,
) {
    enum class IndexType {
        NORMAL,
        NORMAL_REVERSE,
        BITMAP,
        FUNCTION_NORMAL,
        FUNCTION_NORMAL_REVERSE,
        FUNCTION_BITMAP,
    }

    data class IndexColumn(
        val position: Int,
        val name: String,
        val expression: String?,
        val direction: IndexColumnDirection,
    )

    enum class IndexColumnDirection {
        ASCENDING,
        DESCENDING,
    }
}
