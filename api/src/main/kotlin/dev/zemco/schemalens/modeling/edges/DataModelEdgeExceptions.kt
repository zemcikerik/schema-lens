package dev.zemco.schemalens.modeling.edges

class DataModelEdgeReferencedFieldsImmutableException(edgeId: Long) :
    RuntimeException("Referenced fields and positions for edge '$edgeId' are immutable. Only field names and position can be updated.")

class DataModelEdgeIdentifyingCycleException :
    RuntimeException("Edge would introduce a cycle in identifying relationships.")

class DataModelEdgeDuplicateIdentifyingException(fromNodeId: Long, toNodeId: Long) :
    RuntimeException("An identifying edge already exists from node '$fromNodeId' to node '$toNodeId'.")
