import { inject, Injectable, signal } from '@angular/core';
import { defer, map, Observable, of, ReplaySubject, shareReplay, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../models/user.model';
import { UserHttpClientService } from './user-http-client.service';
import { KeyValueStoreService } from '../persistence/key-value-store.service';
import { RegistrationData } from '../models/registration-data.model';
import { AuthResult, RegistrationResult } from '../models/auth.model';
import { Jwt, JwtClaims } from '../models/jwt.model';
import { UpdateUserInfo } from '../models/change-user-info.model';

const JWT_TOKEN_KEY = 'token';
const JWT_EXPIRY_OFFSET = 10;
export const USERNAME_REGEX = /^[a-zA-Z\d_-]+$/;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly userHttpClientService = inject(UserHttpClientService);
  private readonly keyValueStoreService = inject(KeyValueStoreService);

  private _isAuthenticated$ = new ReplaySubject<boolean>(1);
  private _currentUser = signal<User | null>(null);
  private _jwt$ = new ReplaySubject<Jwt | null>(1);
  private _jwt: Jwt | null = null;
  private _jwtRefresh: Observable<string | null> | null = null;

  readonly isAuthenticated = toSignal(this._isAuthenticated$, { initialValue: false });
  readonly isAuthenticated$ = this._isAuthenticated$.asObservable();
  readonly currentUser = this._currentUser.asReadonly();
  readonly jwt = this._jwt$.asObservable();

  attemptAuthFromStorage(): Observable<boolean> {
    return defer(() => {
      if (!this.keyValueStoreService.hasString(JWT_TOKEN_KEY)) {
        this._isAuthenticated$.next(false);
        return of(false);
      }

      this.setJwt(this.parseJwt(this.keyValueStoreService.getStringOrDefault(JWT_TOKEN_KEY, '')));

      if (this._jwt === null) {
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
        this._currentUser.set(user);
        return true;
      }));
    });
  }

  getJwtToken(): Observable<string | null> {
    return defer(() => {
      if (this._jwtRefresh !== null) {
        return this._jwtRefresh;
      }

      if (this._jwt === null || Date.now() / 1000 + JWT_EXPIRY_OFFSET < this._jwt.expiresOn) {
        return of(this._jwt?.rawJwt ?? null);
      }

      const refresh$ = this.userHttpClientService.refresh(this._jwt.refreshToken).pipe(
        tap(rawJwt => {
          this.setJwt(rawJwt !== null ? this.parseJwt(rawJwt) : null);
          if (this._jwt !== null) {
            this.keyValueStoreService.setString(JWT_TOKEN_KEY, rawJwt!);
          } else {
            this.keyValueStoreService.removeString(JWT_TOKEN_KEY);
          }
          this._jwtRefresh = null;
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
      this._jwtRefresh = refresh$;
      return refresh$;
    });
  }

  login(username: string, password: string): Observable<boolean> {
    this.logout();

    return this.userHttpClientService.login(username, password)
      .pipe(map(result => this.updateStateFromAuthResult(result)));
  }

  register(registration: RegistrationData): Observable<RegistrationResult> {
    this.logout();

    return this.userHttpClientService.register(registration).pipe(map(result => {
      if (result === RegistrationResult.USERNAME_TAKEN || result === RegistrationResult.EMAIL_TAKEN) {
        return result;
      }

      this.updateStateFromAuthResult(result);
      return RegistrationResult.SUCCESS;
    }));
  }

  updateCurrentUser(data: UpdateUserInfo): Observable<User> {
    return this.userHttpClientService.updateCurrentUser(data).pipe(
      tap(user => this._currentUser.set(user)),
    );
  }

  logout(): void {
    this._isAuthenticated$.next(false);
    this._currentUser.set(null);
    this.setJwt(null);
    this.keyValueStoreService.removeString(JWT_TOKEN_KEY);
  }

  private updateStateFromAuthResult(result: AuthResult | null): boolean {
    if (result === null) {
      return false;
    }

    this.setJwt(this.parseJwt(result.rawJwt));

    if (this._jwt === null) {
      return false;
    }

    this.keyValueStoreService.setString(JWT_TOKEN_KEY, result.rawJwt);
    this._isAuthenticated$.next(true);
    this._currentUser.set(result.user);
    return true;
  }

  private parseJwt(rawJwt: string): Jwt | null {
    const parts = rawJwt.split('.');

    if (parts.length !== 3) {
      return null;
    }

    const [, encodedClaims] = parts;
    const claims: JwtClaims = JSON.parse(window.atob(encodedClaims));
    return { rawJwt, expiresOn: claims.exp, refreshToken: claims.refresh_token, roles: claims.roles };
  }

  private setJwt(jwt: Jwt | null): void {
    this._jwt = jwt;
    this._jwt$.next(jwt);
  }
}
