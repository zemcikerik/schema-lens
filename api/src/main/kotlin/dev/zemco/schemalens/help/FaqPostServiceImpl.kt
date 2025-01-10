package dev.zemco.schemalens.help

import org.springframework.stereotype.Service

@Service
class FaqPostServiceImpl(
    private val faqPostRepository: FaqPostRepository,
) : FaqPostService {

    override fun getFaqPostsForLocale(locale: Locale): List<FaqPost> =
        faqPostRepository.findByLocale(locale)

}
