export interface Jwt {
  rawJwt: string;
  expiresOn: number;
  refreshToken: string;
}

export interface JwtClaims {
  exp?: number;
  refresh_token?: string;
}
