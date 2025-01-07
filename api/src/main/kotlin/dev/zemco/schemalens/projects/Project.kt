package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Range
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.jdbc.datasource.SimpleDriverDataSource
import java.util.*
import javax.sql.DataSource

@Entity
class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var uuid: UUID = UUID.randomUUID(),

    @NotBlank
    @Column(nullable = false, length = 64)
    var name: String,

    @Column(name = "owner_id", nullable = false)
    var ownerId: Long,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false, insertable = false, updatable = false)
    var owner: User? = null,

    @OneToOne(mappedBy = "project", optional = true, fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var connectionInfo: ProjectConnectionInfo? = null,
)

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
) {
    abstract fun toDataSource(): DataSource
}

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
    var service: String
) : ProjectConnectionInfo(id, host, port, username, password, project) {

    override fun toDataSource(): DataSource = DataSourceBuilder.create()
        .url("jdbc:oracle:thin:@$host:$port/$service")
        .username(username)
        .password(password)
        .type(SimpleDriverDataSource::class.java)
        .build()

}
