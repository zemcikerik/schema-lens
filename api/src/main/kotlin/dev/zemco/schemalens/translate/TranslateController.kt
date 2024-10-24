package dev.zemco.schemalens.translate

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/translations")
class TranslateController(
    private val translateService: TranslateService
) {

    @GetMapping("{locale}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getRawTranslations(@PathVariable locale: Locale): ResponseEntity<String> =
        ResponseEntity.ofNullable(translateService.getRawTranslations(locale))

}
