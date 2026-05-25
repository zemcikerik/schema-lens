export type BackupRunStatus = 'RUNNING' | 'SUCCESS' | 'FAILED';
export type BackupTriggerType = 'MANUAL' | 'SCHEDULED';

export interface AdminBackup {
  configuration: AdminBackupConfiguration;
  runs: AdminBackupRun[];
}

export interface AdminBackupConfiguration {
  automaticEnabled: boolean;
  cronExpression: string;
  retentionDays: number;
  oracleDirectoryName: string;
}

export interface AdminBackupRun {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  status: BackupRunStatus;
  triggerType: BackupTriggerType;
  fileName: string | null;
  logFileName: string;
  fileSizeBytes: number | null;
  errorMessage: string | null;
  createdByUsername: string | null;
}
