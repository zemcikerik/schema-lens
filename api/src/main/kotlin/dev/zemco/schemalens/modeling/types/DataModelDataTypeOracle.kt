package dev.zemco.schemalens.modeling.types

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Lob
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.validation.constraints.NotBlank

@Entity
class DataModelDataTypeOracle(
    @Id
    @Column(name = "type_id")
    var typeId: Long? = null,

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "type_id", nullable = false)
    var dataType: DataModelDataType,

    @field:NotBlank
    @Column(name = "physical", nullable = false, length = 38)
    var physical: String,

    @Lob
    @Column(name = "check_constraint")
    var checkConstraint: String? = null,
)

