package dev.zemco.schemalens.projects

interface ProjectConnectionEncryptor {
    fun encryptPassword(password: String): String
    fun decryptPassword(password: String): String
}
