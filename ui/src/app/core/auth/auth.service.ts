import { inject, Injectable, signal } from '@angular/core';
import { defer, map, Observable, of, ReplaySubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../models/user.model';
import { UserHttpClientService } from './user-http-client.service';
import { KeyValueStoreService } from '../persistence/key-value-store.service';

const JWT_TOKEN_KEY = 'token';
export const USERNAME_REGEX = /^[a-zA-Z\d_-]+$/;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly userHttpClientService = inject(UserHttpClientService);
  private readonly keyValueStoreService = inject(KeyValueStoreService);

  private _isAuthenticated$ = new ReplaySubject<boolean>(1);
  private _currentUser$ = signal<User | null>(null);
  private _jwt = '';

  readonly isAuthenticated = toSignal(this._isAuthenticated$, { initialValue: false });
  readonly currentUser = this._currentUser$.asReadonly();

  get jwt(): string {
    return this._jwt;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }

  attemptAuthFromStorage(): Observable<boolean> {
    return defer(() => {
      this._jwt = this.keyValueStoreService.getStringOrDefault(JWT_TOKEN_KEY, '');

      if (this._jwt === '') {
        this._isAuthenticated$.next(false);
        return of(false);
      }

      return this.userHttpClientService.getCurrentUser().pipe(map(user => {
        if (user === null) {
          this._isAuthenticated$.next(false);
          this.keyValueStoreService.removeString(JWT_TOKEN_KEY);
          return false;
        }

        this._isAuthenticated$.next(true);
        this._currentUser$.set(user);
        return true;
      }));
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return this.userHttpClientService.login(username, password).pipe(map(result => {
      if (result === null) {
        return false;
      }

      this._jwt = result.jwt;
      this.keyValueStoreService.setString(JWT_TOKEN_KEY, result.jwt);
      this._isAuthenticated$.next(true);
      this._currentUser$.set(result.user);
      return true;
    }));
  }

}
