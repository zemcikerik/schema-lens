package dev.zemco.schemalens.projects

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
    var uuid: UUID? = null,

    @NotBlank
    @Column(nullable = false, length = 64)
    var name: String,

    @OneToOne(optional = true, fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinColumn(name = "connection_info_id", referencedColumnName = "id", nullable = true)
    var connectionInfo: ProjectConnectionInfo? = null,
)

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
abstract class ProjectConnectionInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, length = 255)
    var host: String,

    @Column(nullable = false)
    @Range(min = 1, max = 65535)
    var port: Int,

    @NotBlank
    @Column(name = "auth_username", nullable = false, length = 128)
    var username: String,

    @Column(name = "auth_password", nullable = false, length = 128)
    var password: String,
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

    @NotBlank
    @Column(nullable = false, length = 128)
    var service: String
) : ProjectConnectionInfo(id, host, port, username, password) {

    override fun toDataSource(): DataSource = DataSourceBuilder.create()
        .url("jdbc:oracle:thin:@$host:$port/$service")
        .username(username)
        .password(password)
        .type(SimpleDriverDataSource::class.java)
        .build()

}
