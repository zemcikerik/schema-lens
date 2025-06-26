import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { map, Observable, of, throwError } from 'rxjs';
import { SKIP_UNAUTHORIZED_REDIRECT } from '../interceptors/unauthorized.interceptor';
import { catchSpecificHttpStatusError } from '../rxjs-pipes';
import { UpdateUserInfo, User } from '../models/user.model';
import { RegistrationData } from '../models/registration-data.model';
import { AuthResult, RegistrationFailure, RegistrationResult } from '../models/auth.model';
import { NO_AUTHORIZATION } from '../interceptors/jwt.interceptor';
import { ChangePassword } from '../models/change-password.model';

@Injectable({
  providedIn: 'root',
})
export class UserHttpClientService {

  private httpClient = inject(HttpClient);

  getCurrentUser(): Observable<User | null> {
    const context = new HttpContext();
    context.set(SKIP_UNAUTHORIZED_REDIRECT, true); // todo: unused?

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
      catchSpecificHttpStatusError(404, () => of(null)),
    );
  }

  updateCurrentUser(data: UpdateUserInfo): Observable<User> {
    return this.httpClient.put<User>('/user', data);
  }

  updatePassword(data: ChangePassword): Observable<boolean> {
    return this.httpClient.put('/user/password', data).pipe(
      map(() => true),
      catchSpecificHttpStatusError(403, () => of(false)),
    );
  }

  deleteUser(): Observable<unknown> {
    return this.httpClient.delete('/user');
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
