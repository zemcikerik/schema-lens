package dev.zemco.schemalens.help

interface FaqPostService {
    fun getFaqPostsForLocale(locale: Locale): List<FaqPost>
}
