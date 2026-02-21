package dev.zemco.schemalens.modeling.api.entity

class EntityNotFoundException(id: Long) : RuntimeException("Entity with id '$id' not found!")

