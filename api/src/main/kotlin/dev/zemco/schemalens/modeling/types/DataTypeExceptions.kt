package dev.zemco.schemalens.modeling.types

class DataTypeInUseException(id: Long) : RuntimeException("Data type with id '$id' is in use by entity!")
class DataTypeExistsException(name: String) : RuntimeException("Data type with name '$name' already exists!")
class DataTypeParameterExistsException(name: String) : RuntimeException("Data type parameter with name '$name' already exists!")
class DataTypeMappingExistsException(dbSystem: String) : RuntimeException("Data type mapping for '$dbSystem' already exists!")
