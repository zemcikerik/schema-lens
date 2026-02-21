package dev.zemco.schemalens.modeling.api.datatype

class DataTypeNotFoundException(id: Long) : RuntimeException("Data type with id '$id' not found!")
class DataTypeInUseException(id: Long) : RuntimeException("Data type with id '$id' is in use by entity!")
class DataTypeExistsException(name: String) : RuntimeException("Data type with name '$name' already exists!")

