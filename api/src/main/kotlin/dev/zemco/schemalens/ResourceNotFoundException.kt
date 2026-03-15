package dev.zemco.schemalens

class ResourceNotFoundException private constructor(message: String) : RuntimeException(message) {

    companion object {
        fun withId(resourceName: String, id: Any): ResourceNotFoundException =
            ResourceNotFoundException("$resourceName with id '$id' not found!")

        fun withIdentifier(
            resourceName: String,
            identifierName: String,
            identifierValue: Any,
        ): ResourceNotFoundException =
            ResourceNotFoundException("$resourceName with $identifierName '$identifierValue' not found!")
    }
}
