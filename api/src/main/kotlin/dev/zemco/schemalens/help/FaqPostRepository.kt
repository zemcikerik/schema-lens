package dev.zemco.schemalens.help

import org.springframework.data.repository.CrudRepository

interface FaqPostRepository : CrudRepository<FaqPost, Long> {
    fun findByLocale(locale: Locale): List<FaqPost>
}
