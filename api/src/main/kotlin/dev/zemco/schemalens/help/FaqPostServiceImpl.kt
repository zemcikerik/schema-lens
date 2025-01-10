package dev.zemco.schemalens.help

import org.springframework.stereotype.Service

@Service
class FaqPostServiceImpl(
    private val faqPostRepository: FaqPostRepository,
) : FaqPostService {

    override fun deleteFaqPost(faqPost: FaqPost) =
        faqPostRepository.delete(faqPost)

    override fun getFaqPostById(id: Long): FaqPost? =
        faqPostRepository.findById(id).orElse(null)

    override fun getFaqPosts(): List<FaqPost> =
        faqPostRepository.findAll()

    override fun getFaqPostsForLocale(locale: Locale): List<FaqPost> =
        faqPostRepository.findByLocale(locale)

    override fun saveFaqPost(faqPost: FaqPost): FaqPost =
        faqPostRepository.save(faqPost)

}
