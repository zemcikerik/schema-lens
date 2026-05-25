package dev.zemco.schemalens.validation

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.springframework.scheduling.support.CronExpression
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Constraint(validatedBy = [CronExpressionValidator::class])
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY, AnnotationTarget.VALUE_PARAMETER)
annotation class CronExpressionConstraint(
    val message: String = "Invalid cron expression",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)

@Component
class CronExpressionValidator : ConstraintValidator<CronExpressionConstraint, String> {

    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean =
        value == null || CronExpression.isValidExpression(value.trim())
}
