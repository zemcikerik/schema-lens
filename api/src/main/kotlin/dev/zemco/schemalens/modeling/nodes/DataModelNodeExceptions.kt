package dev.zemco.schemalens.modeling.nodes

class DataModelNodeFieldReorderRequestInvalidException(nodeId: Long) :
    RuntimeException("Reorder payload for node '$nodeId' must include each field exactly once and only valid edge field identifiers.")
