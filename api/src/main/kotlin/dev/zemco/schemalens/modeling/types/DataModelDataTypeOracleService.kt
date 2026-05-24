package dev.zemco.schemalens.modeling.types

interface DataModelDataTypeOracleService {
    fun syncOracle(dataType: DataModelDataType, mappings: List<DataModelDataTypeMappingDto>)
}

