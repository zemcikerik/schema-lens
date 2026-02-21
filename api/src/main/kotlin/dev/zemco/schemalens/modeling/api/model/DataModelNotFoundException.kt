package dev.zemco.schemalens.modeling.api.model

class DataModelNotFoundException(id: Long) : RuntimeException("Data model with id '$id' not found!")