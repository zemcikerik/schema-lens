package dev.zemco.schemalens.modeling.types

class DataTypeInUseException(id: Long) : RuntimeException("Data type with id '$id' is in use by entity!")
class DataTypeExistsException(name: String) : RuntimeException("Data type with name '$name' already exists!")
