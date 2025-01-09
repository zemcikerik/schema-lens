import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { inject } from '@angular/core';
import { RoleService } from '../auth/role.service';

export const hasAdminRoleGuard: CanActivateFn = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  return roleService.hasAdminRole$.pipe(tap(async admin => {
    if (!admin) {
      await router.navigate(['/']);
    }
  }));
};
