import { Role } from './role.model';

export interface Jwt {
  rawJwt: string;
  expiresOn: number;
  refreshToken: string;
  roles: Role[];
}

export interface JwtClaims {
  exp: number;
  refresh_token: string;
  roles: Role[];
}
