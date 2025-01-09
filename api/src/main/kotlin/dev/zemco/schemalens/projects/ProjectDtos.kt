package dev.zemco.schemalens.projects

import dev.zemco.schemalens.validation.IpAddressConstraint
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.validator.constraints.Length
import org.hibernate.validator.constraints.Range
import java.util.*

data class ProjectListDto(
    val id: UUID?,
    val name: String,
    val owner: String,
    val currentUserRole: ProjectCollaborationRole? = null,
)

data class OracleProjectPropertiesDto(
    val id: UUID?,

    @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
    @field:Length(max = 64, groups = [OnCreate::class, OnUpdate::class])
    val name: String,
    val owner: String,
    val currentUserRole: ProjectCollaborationRole? = null,

    @field:Valid
    val connection: ConnectionDto,
) {

    data class ConnectionDto(
        @field:IpAddressConstraint(groups = [OnCreate::class, OnUpdate::class])
        val host: String,

        @field:Range(min = 1, max = 65535, groups = [OnCreate::class, OnUpdate::class])
        val port: Int,

        @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
        @field:Length(max = 128, groups = [OnCreate::class, OnUpdate::class])
        val service: String,

        @field:NotBlank(groups = [OnCreate::class, OnUpdate::class])
        @field:Length(max = 128, groups = [OnCreate::class, OnUpdate::class])
        val username: String,

        @field:NotNull(groups = [OnCreate::class])
        @field:Length(min = 1, max = 128, groups = [OnCreate::class, OnUpdate::class])
        val password: String?,
    )

}

data class ProjectConnectionFailureDto(
    val type: ProjectConnectionFailure,
    val message: String?,
)

interface OnCreate
interface OnUpdate
