package dev.zemco.schemalens.meta.oracle.format

import org.springframework.http.MediaType
import org.springframework.web.client.RestClient
import org.springframework.web.client.body

class ApiServiceOracleSqlFormatter(
    private val restClient: RestClient,
) : OracleSqlFormatter {

    override fun formatSql(sql: String): String =
        restClient.post()
            .uri(ORACLE_FORMAT_ENDPOINT)
            .accept(APPLICATION_SQL)
            .contentType(APPLICATION_SQL)
            .body(sql)
            .retrieve()
            .body<String>()!!

    private companion object {
        private const val ORACLE_FORMAT_ENDPOINT = "/oracle"
        private val APPLICATION_SQL = MediaType.parseMediaType("application/sql")
    }

}
