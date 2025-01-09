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
import { UpdateUserInfo } from '../../../core/models/change-user-info.model';

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
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  user = this.authService.currentUser as Signal<User>;

  loading = signal<boolean>(false);
  generalInformationResult = signal<string | true | null>(null);
  changePasswordResult = signal<string | true | null>(null);

  changeUserInfo(data: UpdateUserInfo): void {
    this.beginUpdate();

    this.authService.updateCurrentUser(data).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: () => this.generalInformationResult.set(true),
      error: () => this.generalInformationResult.set('GENERIC.ERROR_LABEL'),
    });
  }

  changePassword(data: ChangePassword): void {
    this.beginUpdate();

    this.userService.updatePassword(data).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: result => this.changePasswordResult.set(result || 'AUTH.WRONG_PASSWORD_LABEL'),
      error: () => this.changePasswordResult.set('GENERIC.ERROR_LABEL'),
    });
  }

  private beginUpdate(): void {
    this.loading.set(true);
    this.generalInformationResult.set(null);
    this.changePasswordResult.set(null);
  }
}
