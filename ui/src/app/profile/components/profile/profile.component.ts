import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, Signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { ProfileGeneralFormComponent } from '../profile-general-form/profile-general-form.component';
import {
  ProfileChangePasswordFormComponent
} from '../profile-change-password-form/profile-change-password-form.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { ChangePassword } from '../../../core/models/change-password.model';
import { UserService } from '../../../core/auth/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
    LayoutHeaderAndContentComponent,
    TranslatePipe,
    ProfileGeneralFormComponent,
    ProfileChangePasswordFormComponent,
    MatButton,
    MatIcon,
    ProgressSpinnerComponent,
    AlertComponent,
  ],
})
export class ProfileComponent {
  user = inject(AuthService).currentUser as Signal<User>;
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  loading = signal<boolean>(false);
  changePasswordResult = signal<string | true | null>(null);

  changePassword(data: ChangePassword): void {
    this.loading.set(true);

    this.userService.updatePassword(data).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: result => this.changePasswordResult.set(result || 'AUTH.WRONG_PASSWORD_LABEL'),
      error: () => this.changePasswordResult.set('GENERIC.ERROR_LABEL'),
    });
  }
}
