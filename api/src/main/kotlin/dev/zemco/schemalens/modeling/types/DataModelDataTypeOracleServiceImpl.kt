package dev.zemco.schemalens.modeling.types

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DataModelDataTypeOracleServiceImpl(
    private val repository: DataModelDataTypeOracleRepository,
) : DataModelDataTypeOracleService {

    @Transactional
    override fun syncOracle(dataType: DataModelDataType, mappings: List<DataModelDataTypeMappingDto>) {
        val typeId = dataType.id ?: return

        val oracleMappings = mappings.filter {
            it.dbSystem.trim().lowercase() == "oracle"
        }

        if (oracleMappings.size > 1) {
            throw IllegalArgumentException("Only one Oracle data type mapping is allowed")
        }

        val requestedMapping = oracleMappings.firstOrNull() ?: run {
            repository.deleteByTypeId(typeId)
            dataType.oracle = null
            return
        }

        val physical = requestedMapping.physicalDataType.trim()
        if (physical.isBlank()) {
            throw IllegalArgumentException("Oracle physical data type cannot be blank")
        }

        val checkConstraint = requestedMapping.checkConstraint?.trim()?.takeIf { it.isNotEmpty() }
        val oracle = repository.findByTypeId(typeId)?.apply {
            this.physical = physical
            this.checkConstraint = checkConstraint
        } ?: DataModelDataTypeOracle(
            dataType = dataType,
            physical = physical,
            checkConstraint = checkConstraint,
        )

        dataType.oracle = repository.save(oracle)
    }
}


