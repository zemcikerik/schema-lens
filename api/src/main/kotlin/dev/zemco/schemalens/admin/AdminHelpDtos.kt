package dev.zemco.schemalens.admin

import dev.zemco.schemalens.locale.Locale
import dev.zemco.schemalens.validation.WhitelistedLocaleConstraint
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Length

data class AdminFaqPostDto(
    val id: Long,
    val locale: Locale,
    val title: String,
    val answer: String,
)

data class AdminCreateFaqPostDto(
    @field:WhitelistedLocaleConstraint
    val locale: Locale,

    @field:NotBlank
    @field:Length(min = 3, max = 128)
    val title: String,

    @field:NotBlank
    @field:Length(min = 3, max = 2048)
    val answer: String,
)

data class AdminUpdateFaqPostDto(
    @field:NotBlank
    @field:Length(min = 3, max = 128)
    val title: String,

    @field:NotBlank
    @field:Length(min = 3, max = 2048)
    val answer: String,
)
