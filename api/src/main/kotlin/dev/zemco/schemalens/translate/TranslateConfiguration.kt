package dev.zemco.schemalens.translate

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.bind.ConstructorBinding
import java.nio.file.Path

@ConfigurationProperties(prefix = "translate")
data class TranslateConfiguration @ConstructorBinding constructor(
    val basePath: Path,
    val allowedLocales: List<Locale>,
)
