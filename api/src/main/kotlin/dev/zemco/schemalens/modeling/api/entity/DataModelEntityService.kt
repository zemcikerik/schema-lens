package dev.zemco.schemalens.modeling.api.entity

import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityDto
import dev.zemco.schemalens.modeling.api.dtos.DataModelEntityInputDto

import jakarta.persistence.EntityNotFoundException
import java.lang.IllegalAccessException
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

interface DataModelEntityService {
    fun createEntity(
        modelId: Long,
        dto: DataModelEntityInputDto,
        userId: Long
    ): DataModelEntityDto

    fun updateEntity(
        modelId: Long,
        entityId: Long,
        dto: DataModelEntityInputDto,
        userId: Long
    ): DataModelEntityDto
    
    fun deleteEntity(
        modelId: Long,
        entityId: Long,
        userId: Long
    )
}
