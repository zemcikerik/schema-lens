package dev.zemco.schemalens.modeling.api.relationship

class RelationshipNotFoundException(id: Long) : RuntimeException("Relationship with id '$id' not found!")