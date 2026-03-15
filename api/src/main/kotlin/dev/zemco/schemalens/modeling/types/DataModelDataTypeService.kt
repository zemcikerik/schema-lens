package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.modeling.models.DataModel

interface DataModelDataTypeService {
    fun createDataType(model: DataModel, dto: DataModelDataTypeInputDto): DataModelDataTypeDto
    fun updateDataType(model: DataModel, typeId: Long, dto: DataModelDataTypeInputDto): DataModelDataTypeDto
    fun deleteDataType(model: DataModel, typeId: Long)
}

