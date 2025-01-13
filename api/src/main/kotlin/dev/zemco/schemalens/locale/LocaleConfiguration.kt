package dev.zemco.schemalens.locale

import jakarta.validation.constraints.NotEmpty
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "locale")
data class LocaleConfiguration(
    @NotEmpty
    val whitelist: List<Locale>
)
