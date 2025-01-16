import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { deepEqual } from 'fast-equals';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  readonly roles$ = inject(AuthService).jwt.pipe(
    map(jwt => jwt?.roles ?? []),
    distinctUntilChanged(deepEqual),
  );

  readonly hasAdminRole$ = this.hasRole(Role.ADMIN);
  readonly hasAdminRole = toSignal(this.hasAdminRole$, { initialValue: false });

  private hasRole(role: Role): Observable<boolean> {
    return this.roles$.pipe(
      map(roles => roles.includes(role)),
      distinctUntilChanged()
    );
  }
}
