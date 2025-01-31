package dev.zemco.schemalens.meta.oracle.format

import org.slf4j.LoggerFactory
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.JdkClientHttpRequestFactory
import org.springframework.web.client.RestClient

@Configuration
@EnableConfigurationProperties(OracleSqlFormatterProperties::class)
class OracleSqlFormatterConfiguration(
    private val oracleSqlFormatterProperties: OracleSqlFormatterProperties,
) {

    @Bean
    fun oracleSqlFormatter(): OracleSqlFormatter =
        oracleSqlFormatterProperties.apiBaseUrl?.let {
            createApiServiceFormatter(it)
        } ?: createTrimFormatter()

    private fun createApiServiceFormatter(apiBaseUrl: String): OracleSqlFormatter =
        RestClient.builder()
            .requestFactory(JdkClientHttpRequestFactory())
            .baseUrl(apiBaseUrl)
            .build()
            .let { ApiServiceOracleSqlFormatter(it) }
            .also { LOGGER.info("Using API service Oracle formatter with API base url: {}", apiBaseUrl) }

    private fun createTrimFormatter(): OracleSqlFormatter {
        val formatter = TrimOracleSqlFormatter()
        LOGGER.info("Using trim Oracle formatter")
        return formatter
    }

    private companion object {
        private val LOGGER = LoggerFactory.getLogger(OracleSqlFormatterConfiguration::class.java)
    }

}
