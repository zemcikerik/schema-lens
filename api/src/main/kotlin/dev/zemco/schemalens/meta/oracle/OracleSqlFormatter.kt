package dev.zemco.schemalens.meta.oracle

import com.github.vertical_blank.sqlformatter.SqlFormatter
import com.github.vertical_blank.sqlformatter.core.FormatConfig
import com.github.vertical_blank.sqlformatter.languages.Dialect
import org.springframework.stereotype.Component

@Component
class OracleSqlFormatter {

    fun formatSql(sql: String): String =
        FormatConfig.builder()
            .indent("  ")
            .linesBetweenQueries(2)
            .maxColumnLength(50)
            .build()
            .let { SqlFormatter.of(Dialect.PlSql).format(sql, it) }
            .trim()

}
