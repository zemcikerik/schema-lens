package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.ResourceAccessDeniedException
import dev.zemco.schemalens.auth.User
import dev.zemco.schemalens.auth.UserService
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.core.ResolvableType
import org.springframework.core.convert.TypeDescriptor
import java.util.*

@ExtendWith(MockKExtension::class)
class ProjectConverterTest {

    @MockK
    private lateinit var projectService: ProjectService

    @MockK
    private lateinit var userService: UserService

    @InjectMockKs
    private lateinit var projectConverter: ProjectConverter

    @Test
    fun `when convert is called without project id, then exception should be thrown`() {
        assertThrows<IllegalArgumentException> { projectConverter.convert(null, FROM_STRING, TO_PROJECT) }
    }

    @Test
    fun `when convert is called with invalid project id, then exception should be thrown`() {
        assertThrows<IllegalArgumentException> { projectConverter.convert("not uuid", FROM_STRING, TO_PROJECT) }
    }

    @Test
    fun `when convert is called with valid project id, then project should be retrieved securely`() {
        every { userService.getCurrentUser() } returns MOCK_USER
        every { projectService.getSecuredProjectByUuid(MOCK_UUID, MOCK_USER) } returns MOCK_PROJECT

        val result = projectConverter.convert(MOCK_UUID.toString(), FROM_STRING, TO_PROJECT)

        assertEquals(MOCK_PROJECT, result)
    }

    @Test
    fun `when convert is called with unknown project id, then exception should be thrown`() {
        every { userService.getCurrentUser() } returns MOCK_USER
        every { projectService.getSecuredProjectByUuid(MOCK_UUID, MOCK_USER) } returns null

        assertThrows<ProjectNotFoundException> {
            projectConverter.convert(MOCK_UUID.toString(), FROM_STRING, TO_PROJECT)
        }
    }

    @Test
    fun `when convert is called with project id for user without access, then exception should be thrown`() {
        every { userService.getCurrentUser() } returns MOCK_USER
        every { projectService.getSecuredProjectByUuid(MOCK_UUID, MOCK_USER) } throws ResourceAccessDeniedException()

        assertThrows<ResourceAccessDeniedException> {
            projectConverter.convert(MOCK_UUID.toString(), FROM_STRING, TO_PROJECT)
        }
    }

    @Test
    fun `when convert is called with valid project id with no ownership check, then project should be retrieved`() {
        every { projectService.getProjectByUuid(MOCK_UUID) } returns MOCK_PROJECT
        val result = projectConverter.convert(MOCK_UUID.toString(), FROM_STRING, TO_PROJECT_INSECURE)
        assertEquals(MOCK_PROJECT, result)
    }

    private companion object {
        private val FROM_STRING = TypeDescriptor.valueOf(String::class.java)
        private val TO_PROJECT = TypeDescriptor.valueOf(Project::class.java)
        private val TO_PROJECT_INSECURE = TypeDescriptor(
            ResolvableType.forClass(Project::class.java), null, arrayOf(NoOwnershipCheck()))

        private val MOCK_USER = User()
        private val MOCK_UUID = UUID.randomUUID()
        private val MOCK_PROJECT = Project(id = 3, uuid = MOCK_UUID, name = "Test", dbInfo = null)
    }

}
