package dev.zemco.schemalens.modeling.types

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeParameterServiceImpl(
    private val repository: DataModelDataTypeParameterRepository,
) : DataModelDataTypeParameterService {

    @Transactional
    override fun syncParameters(dataType: DataModelDataType, parameters: List<DataModelDataTypeParameterDto>) {
        val typeId = dataType.id ?: return
        val normalizedNames = mutableSetOf<String>()

        val normalizedParameters = parameters.map {
            val normalizedName = it.name.trim()
            val normalizedKey = normalizedName.uppercase()

            if (!normalizedNames.add(normalizedKey)) {
                throw DataTypeParameterExistsException(normalizedName)
            }

            normalizedName
        }

        repository.deleteByTypeId(typeId)

        if (normalizedParameters.isEmpty()) {
            dataType.parameters = mutableSetOf()
            return
        }

        val saved = repository.saveAll(
            normalizedParameters.map { normalizedName ->
                DataModelDataTypeParameter(
                    id = DataModelDataTypeParameter.Id(
                        typeId = typeId,
                        name = normalizedName,
                    ),
                    dataType = dataType,
                )
            },
        )

        dataType.parameters = saved.toMutableSet()
    }
}

