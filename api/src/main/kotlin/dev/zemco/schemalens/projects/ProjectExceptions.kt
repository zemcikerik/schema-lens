package dev.zemco.schemalens.projects

import java.util.UUID

class ProjectNotFoundException(uuid: UUID) : RuntimeException("Project with UUID '$uuid' not found!")
