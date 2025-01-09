package dev.zemco.schemalens.profile

import dev.zemco.schemalens.auth.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/user/profile-picture")
class ProfilePictureController(
    private val userService: UserService,
    private val profilePictureService: ProfilePictureService,
) {

    @PostMapping
    fun setProfilePicture(@RequestPart("profilePicture") multipartFile: MultipartFile): ResponseEntity<Any> {
        val user = userService.getCurrentUser()

        val status = if (profilePictureService.saveProfilePicture(user.username, multipartFile.resource))
            HttpStatus.NO_CONTENT else HttpStatus.BAD_REQUEST

        return ResponseEntity.status(status).build()
    }

}
