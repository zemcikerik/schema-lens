package dev.zemco.schemalens.projects

import dev.zemco.schemalens.auth.User
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*

@ExtendWith(MockKExtension::class)
class ProjectServiceImplTest {

    @MockK
    private lateinit var projectRepository: ProjectRepository

    @InjectMockKs
    private lateinit var projectService: ProjectServiceImpl

    @Test
    fun `when getProjectByUuid is called, then project should be retrieved from repository`() {
        every { projectRepository.findByUuid(MOCK_UUID) } returns MOCK_PROJECT
        val result = projectService.getProjectByUuid(MOCK_UUID)
        assertEquals(MOCK_PROJECT, result)
    }

    private companion object {
        private val MOCK_UUID = UUID.randomUUID()
        private val MOCK_PROJECT = Project(
            id = 4,
            uuid = MOCK_UUID,
            name = "Mock Project",
            ownerId = 3,
            owner = mockk<User>(),
            connectionInfo = mockk<ProjectConnectionInfo>()
        )
    }

}
