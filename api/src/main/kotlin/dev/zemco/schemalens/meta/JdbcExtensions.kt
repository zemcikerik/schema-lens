package dev.zemco.schemalens.meta

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import java.sql.ResultSet
import javax.sql.DataSource

fun DataSource.toJdbcTemplate(): JdbcTemplate = JdbcTemplate(this)
fun DataSource.toNamedJdbcTemplate(): NamedParameterJdbcTemplate = NamedParameterJdbcTemplate(this)

fun ResultSet.getNullableInt(name: String): Int? = getInt(name).let { if (wasNull()) null else it }
