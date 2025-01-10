package dev.zemco.schemalens.admin

import dev.zemco.schemalens.help.FaqPost
import dev.zemco.schemalens.help.FaqPostService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/admin/help")
class AdminHelpController(
    private val faqPostService: FaqPostService,
) {

    @GetMapping("/faq")
    fun getFaqPosts(): List<AdminFaqPostDto> =
        faqPostService.getFaqPosts().map { it.mapToDto() }

    @PostMapping("/faq")
    fun addFaqPost(@RequestBody @Valid faqPostDto: AdminCreateFaqPostDto): AdminFaqPostDto =
        faqPostService.saveFaqPost(FaqPost(
            locale = faqPostDto.locale,
            title = faqPostDto.title,
            answer = faqPostDto.answer,
        )).mapToDto()

    @PutMapping("/faq/{postId}")
    fun updateFaqPost(
        @PathVariable postId: Long,
        @RequestBody @Valid faqPostDto: AdminUpdateFaqPostDto
    ): ResponseEntity<AdminFaqPostDto> =
        faqPostService.getFaqPostById(postId)?.let {
            it.title = faqPostDto.title
            it.answer = faqPostDto.answer
            ResponseEntity.ok(faqPostService.saveFaqPost(it).mapToDto())
        } ?: ResponseEntity.notFound().build()

    @DeleteMapping("/faq/{postId}")
    fun deleteFaqPost(@PathVariable postId: Long): ResponseEntity<Any> =
        faqPostService.getFaqPostById(postId)?.let {
            faqPostService.deleteFaqPost(it)
            ResponseEntity.noContent().build()
        } ?: ResponseEntity.notFound().build()

    private fun FaqPost.mapToDto(): AdminFaqPostDto =
        AdminFaqPostDto(id!!, locale, title, answer)

}
