package dev.zemco.schemalens.modeling.models

import dev.zemco.schemalens.ResourceNotFoundException
import dev.zemco.schemalens.auth.UserService
import org.slf4j.LoggerFactory
import org.springframework.core.convert.TypeDescriptor
import org.springframework.core.convert.converter.GenericConverter
import org.springframework.core.convert.converter.GenericConverter.ConvertiblePair
import org.springframework.stereotype.Component

@Component
class DataModelConverter(
    private val dataModelService: DataModelService,
    private val userService: UserService,
) : GenericConverter {

    override fun getConvertibleTypes(): Set<ConvertiblePair> =
        setOf(ConvertiblePair(String::class.java, DataModel::class.java))

    override fun convert(source: Any?, sourceType: TypeDescriptor, targetType: TypeDescriptor): Any? {
        val rawModelId = source as String? ?: throw IllegalArgumentException("Data model ID must be specified!")
        val modelId = rawModelId.toLongOrNull()
            ?: throw IllegalArgumentException("Data model ID must be a valid number!")

        val model = if (targetType.hasAnnotation(NoOwnershipCheck::class.java)) {
            retrieveModelUnsecure(modelId)
        } else {
            retrieveModel(modelId)
        }

        return model ?: throw ResourceNotFoundException.withId("Data model", modelId)
    }

    private fun retrieveModelUnsecure(modelId: Long): DataModel? {
        LOGGER.debug("Retrieving unsecured data model with id: {}", modelId)
        return dataModelService.getDataModelById(modelId)
    }

    private fun retrieveModel(modelId: Long): DataModel? {
        LOGGER.debug("Retrieving secured data model with id: {}", modelId)
        val user = userService.getCurrentUser()
        return dataModelService.getSecuredDataModelById(modelId, user)
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(DataModelConverter::class.java)
    }
}

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class NoOwnershipCheck
