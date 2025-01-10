package dev.zemco.schemalens.projects

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Range

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class ProjectConnectionInfo(
    @Id
    var id: Long? = null,

    @NotBlank
    @Column(nullable = false, length = 255)
    var host: String,

    @Column(nullable = false)
    @Range(min = 1, max = 65535)
    var port: Int,

    @NotBlank
    @Column(name = "auth_username", nullable = false, length = 128)
    var username: String,

    @NotBlank
    @Column(name = "auth_password", nullable = false, length = 128)
    var password: String,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", referencedColumnName = "id", nullable = false)
    @MapsId
    var project: Project? = null,

    @Transient
    var passwordChanged: Boolean = false,
)

@Entity
class OracleProjectConnectionInfo(
    id: Long? = null,
    host: String,
    port: Int,
    username: String,
    password: String,
    project: Project? = null,

    @NotBlank
    @Column(nullable = false, length = 128)
    var service: String,

    passwordChanged: Boolean = false,
) : ProjectConnectionInfo(id, host, port, username, password, project, passwordChanged)
