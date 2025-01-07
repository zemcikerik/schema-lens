import { User } from './user.model';

export interface AuthResult {
  user: User;
  jwt: string;
}

export enum RegistrationResult {
  SUCCESS = 'SUCCESS',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
}

export type RegistrationFailure = Exclude<RegistrationResult, RegistrationResult.SUCCESS>;
