package dev.zemco.schemalens.modeling.api.attribute

class AttributeNotFoundException(id: Long) : RuntimeException("Attribute with id '$id' not found!")

