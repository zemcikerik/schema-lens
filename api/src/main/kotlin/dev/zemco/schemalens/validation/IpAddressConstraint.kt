package dev.zemco.schemalens.validation

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import org.apache.commons.validator.routines.InetAddressValidator
import org.springframework.stereotype.Component
import java.net.InetAddress
import kotlin.reflect.KClass

@Constraint(validatedBy = [IpAddressValidator::class])
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.FIELD)
annotation class IpAddressConstraint(
    val message: String = "Invalid IP address",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
    val allowLocalAddresses: Boolean = false,
)

@Component
class IpAddressValidator : ConstraintValidator<IpAddressConstraint, String> {

    private var allowLocalAddresses: Boolean = false

    override fun initialize(constraintAnnotation: IpAddressConstraint) {
        allowLocalAddresses = constraintAnnotation.allowLocalAddresses
    }

    override fun isValid(value: String?, context: ConstraintValidatorContext): Boolean =
        value == null || (IP_VALIDATOR.isValid(value) && checkNonLocalAddress(value))

    private fun checkNonLocalAddress(ipAddress: String): Boolean {
        if (allowLocalAddresses) {
            return true
        }

        return try {
            !InetAddress.getByName(ipAddress).let {
                it.isLoopbackAddress || it.isLinkLocalAddress || it.isSiteLocalAddress || it.isMulticastAddress || it.isAnyLocalAddress
            }
        } catch (e: Exception) {
            false
        }
    }

    private companion object {
        private val IP_VALIDATOR = InetAddressValidator.getInstance()
    }

}
