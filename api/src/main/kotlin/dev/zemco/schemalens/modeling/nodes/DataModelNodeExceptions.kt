package dev.zemco.schemalens.modeling.nodes

class DataModelNodeFieldReorderRequestInvalidException(nodeId: Long) :
    RuntimeException("Reorder payload for node '$nodeId' must include each field exactly once and only valid edge field identifiers.")

class NodeExistsException(name: String) :
    RuntimeException("Node with name '$name' already exists!")

class FieldNameNotUniqueException(name: String) :
    RuntimeException("Field with name '$name' already exists on this node!")
