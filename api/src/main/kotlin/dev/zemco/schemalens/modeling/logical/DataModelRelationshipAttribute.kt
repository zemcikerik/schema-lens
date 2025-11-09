package dev.zemco.schemalens.modeling.logical

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.validation.constraints.NotBlank

@Entity
class DataModelRelationshipAttribute(
    @EmbeddedId
    var id: Id,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "relationship_id", nullable = false, insertable = false, updatable = false)
    var relationship: DataModelRelationship,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "referenced_attribute_id", nullable = false, insertable = false, updatable = false)
    var referencedAttribute: DataModelAttribute,

    @field:NotBlank
    @Column(nullable = false, length = 30)
    var name: String,

    @Column(nullable = false)
    var position: Short,
) {
    @Embeddable
    data class Id(
        @Column(name = "relationship_id", nullable = false)
        var relationshipId: Long,

        @Column(name = "referenced_attribute_id", nullable = false)
        var referencedAttributeId: Long,
    )
}
