import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminUserManagementComponent {
}
