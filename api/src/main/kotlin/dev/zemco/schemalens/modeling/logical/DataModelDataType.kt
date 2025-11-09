package dev.zemco.schemalens.modeling.logical

import dev.zemco.schemalens.modeling.DataModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
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
)
