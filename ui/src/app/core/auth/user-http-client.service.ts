import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { map, Observable, of, throwError } from 'rxjs';
import { SKIP_UNAUTHORIZED_REDIRECT } from '../interceptors/unauthorized.interceptor';
import { catch404StatusError, catchSpecificHttpStatusError } from '../rxjs-pipes';
import { User } from '../models/user.model';
import { RegistrationData } from '../models/registration-data.model';
import { AuthResult, RegistrationFailure, RegistrationResult } from '../models/auth.model';
import { NO_AUTHORIZATION } from '../interceptors/jwt.interceptor';

@Injectable({
  providedIn: 'root',
})
export class UserHttpClientService {

  private httpClient = inject(HttpClient);

  getCurrentUser(): Observable<User | null> {
    const context = new HttpContext();
    context.set(SKIP_UNAUTHORIZED_REDIRECT, true);

    return this.httpClient.get<User>('/user').pipe(
      catchSpecificHttpStatusError(401, () => of(null)),
    );
  }

  login(username: string, password: string): Observable<AuthResult | null> {
    const context = new HttpContext();
    context.set(SKIP_UNAUTHORIZED_REDIRECT, true);

    return this.httpClient.post<User>('/user/login', { username, password }, { context, observe: 'response' }).pipe(
      map(response => ({ user: this.extractUserFrom(response), rawJwt: this.extractJwtFrom(response) })),
      catchSpecificHttpStatusError(401, () => of(null)),
    );
  }

  register(registration: RegistrationData): Observable<AuthResult | RegistrationFailure> {
    const context = new HttpContext();
    context.set(SKIP_UNAUTHORIZED_REDIRECT, true);

    return this.httpClient.post<User>('/user', registration, { context, observe: 'response' }).pipe(
      map(response => ({ user: this.extractUserFrom(response), rawJwt: this.extractJwtFrom(response) })),
      catchSpecificHttpStatusError(409, err =>
        [RegistrationResult.USERNAME_TAKEN, RegistrationResult.EMAIL_TAKEN].includes(err.error)
          ? of(err.error)
          : throwError(() => err)
      ),
    );
  }

  refresh(refreshToken: string): Observable<string | null> {
    const context = new HttpContext();
    context.set(SKIP_UNAUTHORIZED_REDIRECT, true);
    context.set(NO_AUTHORIZATION, true);

    return this.httpClient.post('/user/login/refresh', refreshToken, { context, observe: 'response' }).pipe(
      map(response => this.extractJwtFrom(response)),
      catch404StatusError(() => of(null)),
    );
  }

  private extractJwtFrom(response: HttpResponse<unknown>): string {
    const authorization = response.headers.get('Authorization');
    const jwt = authorization?.substring(7);

    if (!jwt) {
      throw Error('Response header does not contain a JWT token!');
    }

    return jwt;
  }

  private extractUserFrom(response: HttpResponse<User>): User {
    const user = response.body;

    if (!user) {
      throw Error('Response does not contain a user!');
    }

    return user;
  }

}
