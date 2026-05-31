package dev.zemco.schemalens.modeling.types

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeParameterServiceImpl : DataModelDataTypeParameterService {

    @Transactional
    override fun syncParameters(dataType: DataModelDataType, parameters: List<DataModelDataTypeParameterDto>) {
        val typeId = dataType.id ?: return
        val parameterNames = normalizeParameterNames(parameters)
        val existingByName = dataType.parameters.associateBy { it.id.name.uppercase() }
        val requestedKeys = parameterNames.map { it.uppercase() }.toSet()

        dataType.parameters.removeIf { it.id.name.uppercase() !in requestedKeys }

        val retainedKeys = dataType.parameters.map { it.id.name.uppercase() }.toSet()
        val newParameters = parameterNames
            .filter { it.uppercase() !in retainedKeys }
            .map { parameterName ->
                existingByName[parameterName.uppercase()]
                    ?: DataModelDataTypeParameter(
                        id = DataModelDataTypeParameter.Id(
                            typeId = typeId,
                            name = parameterName,
                        ),
                        dataType = dataType,
                    )
            }

        dataType.parameters.addAll(newParameters)
    }

    private fun normalizeParameterNames(parameters: List<DataModelDataTypeParameterDto>): List<String> {
        val normalizedNames = mutableSetOf<String>()

        return parameters.map { parameter ->
            val normalizedName = parameter.name.trim()
            val normalizedKey = normalizedName.uppercase()

            if (!normalizedNames.add(normalizedKey)) {
                throw DataTypeParameterExistsException(normalizedName)
            }

            normalizedName
        }
    }
}
