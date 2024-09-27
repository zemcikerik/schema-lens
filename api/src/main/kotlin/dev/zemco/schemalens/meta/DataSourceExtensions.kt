package dev.zemco.schemalens.meta

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import javax.sql.DataSource

fun DataSource.toJdbcTemplate(): JdbcTemplate = JdbcTemplate(this)
fun DataSource.toNamedJdbcTemplate(): NamedParameterJdbcTemplate = NamedParameterJdbcTemplate(this)
