package dev.zemco.schemalens.modeling.edges

class DataModelEdgeReferencedFieldsImmutableException(edgeId: Long) :
    RuntimeException("Referenced fields and positions for edge '$edgeId' are immutable. Only field names and position can be updated.")
