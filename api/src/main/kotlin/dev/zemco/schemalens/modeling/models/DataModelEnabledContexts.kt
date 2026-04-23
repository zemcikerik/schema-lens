package dev.zemco.schemalens.modeling.models

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
class DataModelEnabledContexts(
    @Column(name = "oracle_physical_context_enabled", nullable = false)
    var oracleEnabled: Boolean = true,
)
