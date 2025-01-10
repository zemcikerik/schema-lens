package dev.zemco.schemalens.help

interface FaqPostService {
    fun deleteFaqPost(faqPost: FaqPost)
    fun getFaqPostById(id: Long): FaqPost?
    fun getFaqPosts(): List<FaqPost>
    fun getFaqPostsForLocale(locale: Locale): List<FaqPost>
    fun saveFaqPost(faqPost: FaqPost): FaqPost
}
