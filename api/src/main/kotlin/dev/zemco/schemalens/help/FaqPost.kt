package dev.zemco.schemalens.help

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

@Entity
class FaqPost(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @NotNull
    @Convert(converter = LocaleConverter::class)
    var locale: Locale,

    @Column(nullable = false, length = 128)
    var title: String,

    @Column(nullable = false, length = 2048)
    var answer: String,
)
