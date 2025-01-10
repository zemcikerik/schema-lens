package dev.zemco.schemalens.help

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
    fun getFaqPosts(@PathVariable locale: Locale): List<FaqPostDto> =
        faqPostService.getFaqPostsForLocale(locale).map {
            FaqPostDto(it.title, it.answer)
        }

}
