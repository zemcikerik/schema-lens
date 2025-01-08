package dev.zemco.schemalens.projects

enum class ProjectConnectionFailure {
    CONNECTION_FAILURE,
    TIMEOUT,
    INTEGRITY_VIOLATION,
    PERMISSION_DENIED,
    UNKNOWN,
}

class ProjectConnectionException(
    val type: ProjectConnectionFailure,
    message: String?,
    cause: Throwable?,
) : RuntimeException(message, cause)
