package dev.zemco.schemalens.validation

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Constraint(validatedBy = [UsernameValidator::class])
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY, AnnotationTarget.VALUE_PARAMETER)
annotation class UsernameConstraint(
    val message: String = "Invalid username",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)

@Component
class UsernameValidator : ConstraintValidator<UsernameConstraint, String> {

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean =
        value == null || USERNAME_REGEX.matches(value)

    private companion object {
        private val USERNAME_REGEX = "^[a-zA-Z\\d_\\-]+$".toRegex()
    }

}
