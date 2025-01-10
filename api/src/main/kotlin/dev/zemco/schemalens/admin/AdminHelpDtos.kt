package dev.zemco.schemalens.admin

import dev.zemco.schemalens.help.Locale
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Length

data class AdminFaqPostDto(
    val id: Long,
    val locale: Locale,
    val title: String,
    val answer: String,
)

data class AdminCreateFaqPostDto(
    val locale: Locale,

    @NotBlank
    @Length(min = 3, max = 128)
    val title: String,

    @NotBlank
    @Length(min = 3, max = 2048)
    val answer: String,
)

data class AdminUpdateFaqPostDto(
    @NotBlank
    @Length(min = 3, max = 128)
    val title: String,

    @NotBlank
    @Length(min = 3, max = 2048)
    val answer: String,
)
