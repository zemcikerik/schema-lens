import { inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { RoleService } from '../auth/role.service';

@Pipe({
  name: 'hasRole',
  standalone: true,
  pure: true,
})
export class HasRolePipe implements PipeTransform {

  private roleService = inject(RoleService);

  transform(role: 'ADMIN'): Signal<boolean> {
    switch (role) {
      case 'ADMIN':
        return this.roleService.hasAdminRole;
    }
  }

}
