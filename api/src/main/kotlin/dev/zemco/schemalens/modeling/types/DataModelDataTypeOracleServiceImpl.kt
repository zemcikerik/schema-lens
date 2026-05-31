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

        val requestedMapping = findRequestedOracleMapping(mappings) ?: run {
            removeOracleMapping(dataType, typeId)
            return
        }

        val physical = normalizePhysicalDataType(requestedMapping)
        val checkConstraint = requestedMapping.checkConstraint.normalizeCheckConstraint()

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

    private fun removeOracleMapping(dataType: DataModelDataType, typeId: Long) {
        if (dataType.oracle != null) {
            repository.deleteByTypeId(typeId)
            dataType.oracle = null
        }
    }

    private fun findRequestedOracleMapping(mappings: List<DataModelDataTypeMappingDto>): DataModelDataTypeMappingDto? {
        val oracleMappings = mappings.filter {
            it.dbSystem.trim().equals(ORACLE_DB_SYSTEM, ignoreCase = true)
        }

        if (oracleMappings.size > 1) {
            throw DataTypeMappingExistsException(ORACLE_DB_SYSTEM)
        }

        return oracleMappings.firstOrNull()
    }

    private fun normalizePhysicalDataType(mapping: DataModelDataTypeMappingDto): String {
        val physical = mapping.physicalDataType.trim()

        if (physical.isBlank()) {
            throw IllegalArgumentException("Oracle physical data type cannot be blank")
        }

        return physical
    }

    private fun String?.normalizeCheckConstraint(): String? =
        this?.trim()?.takeIf { it.isNotEmpty() }

    private companion object {
        const val ORACLE_DB_SYSTEM = "oracle"
    }
}
