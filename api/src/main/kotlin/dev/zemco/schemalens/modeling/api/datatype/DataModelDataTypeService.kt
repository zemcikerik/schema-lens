package dev.zemco.schemalens.modeling.api.datatype

import dev.zemco.schemalens.modeling.api.dtos.DataModelDataTypeDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelDataTypeInputDto

import jakarta.persistence.EntityNotFoundException
import java.lang.IllegalAccessException
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

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
