package dev.zemco.schemalens.profile

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.springframework.boot.context.properties.ConfigurationProperties
import java.nio.file.Path

@ConfigurationProperties(prefix = "storage.profile-picture")
data class ProfilePictureConfiguration(
    @field:Min(8)
    val maximumWidth: Int = 256,

    @field:Min(8)
    val maximumHeight: Int = 256,

    @field:NotBlank
    val folderPath: Path,
)
