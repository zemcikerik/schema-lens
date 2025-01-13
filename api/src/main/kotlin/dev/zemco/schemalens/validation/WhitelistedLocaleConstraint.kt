package dev.zemco.schemalens.validation

import dev.zemco.schemalens.locale.Locale
import dev.zemco.schemalens.locale.LocaleConfiguration
import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Constraint(validatedBy = [WhitelistedLocaleValidator::class])
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY, AnnotationTarget.VALUE_PARAMETER)
annotation class WhitelistedLocaleConstraint(
    val message: String = "Locale not allowed",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)

@Component
class WhitelistedLocaleValidator(
    private val localeConfiguration: LocaleConfiguration,
) : ConstraintValidator<WhitelistedLocaleConstraint, Locale> {

    override fun isValid(value: Locale?, context: ConstraintValidatorContext?): Boolean =
        value == null || localeConfiguration.whitelist.contains(value)

}
