package dev.zemco.schemalens.modeling.api.datatype

interface DataModelDataTypeService {
    fun createDataType(
        modelId: Long,
        dto: DataModelDataTypeInputDto,
        userId: Long
    ): DataModelDataTypeDto

    fun updateDataType(
        modelId: Long,
        typeId: Long,
        dto: DataModelDataTypeInputDto,
        userId: Long
    ): DataModelDataTypeDto


    fun deleteDataType(
        modelId: Long,
        typeId: Long,
        userId: Long
    )
}
