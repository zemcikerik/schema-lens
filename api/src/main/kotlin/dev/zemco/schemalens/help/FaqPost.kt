package dev.zemco.schemalens.help

import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.validation.constraints.NotNull

@Entity
class FaqPost(
    @Id
    @GeneratedValue
    var id: Long? = null,

    @NotNull
    @Convert(converter = LocaleConverter::class)
    var locale: Locale,

    @Column(nullable = false, length = 128)
    var title: String,

    @Column(nullable = false, length = 2048)
    var answer: String,
)
