import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { SKIP_UNAUTHORIZED_REDIRECT } from '../interceptors/unauthorized.interceptor';
import { catchSpecificHttpStatusError } from '../rxjs-pipes';
import { User } from '../models/user.model';

export interface LoginResult {
  user: User;
  jwt: string;
}

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

  login(username: string, password: string): Observable<LoginResult | null> {
    const context = new HttpContext();
    context.set(SKIP_UNAUTHORIZED_REDIRECT, true);

    return this.httpClient.post<User>('/user/login', { username, password }, { context, observe: 'response' }).pipe(
      map(response => {
        const user = response.body;
        const authorization = response.headers.get('Authorization');
        const jwt = authorization?.substring(7);

        if (!jwt) {
          throw Error('Response header does not contain a JWT token!');
        }
        if (!user) {
          throw Error('Response does not contain a user!');
        }

        return { user, jwt };
      }),
      catchSpecificHttpStatusError(401, () => of(null)),
    );
  }

}
