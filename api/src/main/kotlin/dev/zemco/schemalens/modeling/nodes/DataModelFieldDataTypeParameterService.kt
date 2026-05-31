package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.types.DataModelDataType

interface DataModelFieldDataTypeParameterService {
    fun syncParameters(
        field: DataModelField,
        dataType: DataModelDataType,
        requestedParameters: List<DataModelFieldDataTypeParameterInputDto>?,
        clearWhenAbsent: Boolean,
    )
}
