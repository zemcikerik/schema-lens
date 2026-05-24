package dev.zemco.schemalens.modeling.types

import dev.zemco.schemalens.modeling.models.DataModel
import jakarta.persistence.Column
import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.validation.constraints.NotBlank

@Entity
class DataModelDataType(
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    @Column(name = "type_id")
    var id: Long? = null,

    @Column(name = "model_id", nullable = false)
    val modelId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "model_id", nullable = false, insertable = false, updatable = false)
    val model: DataModel,

    @field:NotBlank
    @Column(nullable = false, length = 40)
    var name: String,

    @OneToOne(mappedBy = "dataType", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var oracle: DataModelDataTypeOracle? = null,

    @OneToMany(mappedBy = "dataType", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var parameters: MutableSet<DataModelDataTypeParameter> = mutableSetOf(),
)
