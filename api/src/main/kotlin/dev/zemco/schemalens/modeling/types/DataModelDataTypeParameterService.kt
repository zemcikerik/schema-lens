package dev.zemco.schemalens.modeling.types

interface DataModelDataTypeParameterService {
    fun syncParameters(dataType: DataModelDataType, parameters: List<DataModelDataTypeParameterDto>)
}

