export enum ProjectConnectionFailure {
  CONNECTION_FAILURE = 'CONNECTION_FAILURE',
  TIMEOUT = 'TIMEOUT',
  INTEGRITY_VIOLATION = 'INTEGRITY_VIOLATION',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN = 'UNKNOWN',
}

export interface ProjectConnectionError {
  type: ProjectConnectionFailure;
  message: string | null;
}

export const isProjectConnectionError = (err: unknown): err is ProjectConnectionError =>
  !!(err && typeof err === 'object' && 'type' in err && 'message' in err);
