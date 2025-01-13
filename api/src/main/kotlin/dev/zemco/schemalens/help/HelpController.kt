package dev.zemco.schemalens.help

import dev.zemco.schemalens.locale.Locale
import dev.zemco.schemalens.validation.WhitelistedLocaleConstraint
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/help")
class HelpController(
    private val faqPostService: FaqPostService,
) {

    @GetMapping("/faq/{locale}")
    fun getFaqPosts(@PathVariable @WhitelistedLocaleConstraint locale: Locale): List<FaqPostDto> =
        faqPostService.getFaqPostsForLocale(locale).sortedBy { it.id }.map {
            FaqPostDto(it.title, it.answer)
        }

}
