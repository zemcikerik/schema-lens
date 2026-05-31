package dev.zemco.schemalens.modeling.nodes

import dev.zemco.schemalens.modeling.types.DataModelDataType
import dev.zemco.schemalens.modeling.types.DataModelFieldDataTypeParameter
import org.springframework.stereotype.Service

@Service
class DataModelFieldDataTypeParameterServiceImpl : DataModelFieldDataTypeParameterService {

    override fun syncParameters(
        field: DataModelField,
        dataType: DataModelDataType,
        requestedParameters: List<DataModelFieldDataTypeParameterInputDto>?,
        clearWhenAbsent: Boolean,
    ) {
        if (requestedParameters == null) {
            if (clearWhenAbsent) {
                field.typeParameters.clear()
            }
            return
        }

        field.typeParameters.clear()

        if (dataType.parameters.isEmpty()) {
            return
        }

        field.typeParameters.addAll(buildFieldDataTypeParameters(field, dataType, requestedParameters))
    }

    private fun buildFieldDataTypeParameters(
        field: DataModelField,
        dataType: DataModelDataType,
        requestedParameters: List<DataModelFieldDataTypeParameterInputDto>,
    ): List<DataModelFieldDataTypeParameter> {
        val inputByName = normalizeByParameterName(requestedParameters)
        val availableParameters = dataType.parameters.associateBy { it.id.name.uppercase() }
        val unknownName = inputByName.keys.firstOrNull { it !in availableParameters }

        if (unknownName != null) {
            throw FieldDataTypeParameterUnknownException(inputByName.getValue(unknownName).name)
        }

        return dataType.parameters.map { parameter ->
            val value = inputByName[parameter.id.name.uppercase()]?.value
            DataModelFieldDataTypeParameter(
                id = DataModelFieldDataTypeParameter.Id(
                    fieldId = field.id ?: 0,
                    typeId = dataType.id!!,
                    name = parameter.id.name,
                ),
                field = field,
                parameter = parameter,
                value = value,
            )
        }
    }

    private fun normalizeByParameterName(
        requestedParameters: List<DataModelFieldDataTypeParameterInputDto>,
    ): Map<String, DataModelFieldDataTypeParameterInputDto> {
        val inputByName = linkedMapOf<String, DataModelFieldDataTypeParameterInputDto>()

        for (input in requestedParameters) {
            val normalizedName = input.name.trim()
            val normalizedKey = normalizedName.uppercase()

            if (inputByName.put(normalizedKey, input.copy(name = normalizedName)) != null) {
                throw FieldDataTypeParameterExistsException(normalizedName)
            }
        }

        return inputByName
    }
}
