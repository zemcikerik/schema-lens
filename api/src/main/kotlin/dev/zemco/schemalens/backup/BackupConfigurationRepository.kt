package dev.zemco.schemalens.backup

import org.springframework.data.repository.CrudRepository

interface BackupConfigurationRepository : CrudRepository<BackupConfiguration, Long>
