import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, Signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { AuthService } from '../../../core/auth/auth.service';
import { UpdateUserInfo, User } from '../../../core/models/user.model';
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
import { catchError, filter, finalize, map, mergeMap, of, tap } from 'rxjs';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogService } from '../../../core/dialog.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

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
  private profileService = inject(ProfileService);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user = this.authService.currentUser as Signal<User>;

  loading = signal<boolean>(false);
  generalInformationResult = signal<string | true | null>(null);
  changePasswordResult = signal<string | true | null>(null);
  deleteError = signal<boolean>(false);

  changeUserInfo(data: UpdateUserInfo): void {
    type Failure = 'user' | 'picture-bad' | 'picture-unknown' | null;

    const FAILURE_MAPPINGS: Record<Exclude<Failure, null>, string | true> = {
      'user': 'GENERIC.ERROR_LABEL',
      'picture-bad': 'PROFILE.PICTURE_BAD_ERROR',
      'picture-unknown': 'PROFILE.PICTURE_UNKNOWN_ERROR',
    };

    this.beginUpdate();

    this.authService.updateCurrentUser(this.withoutProfilePicture(data)).pipe(
      map(() => null),
      catchError(() => of('fail-user' as Failure)),
      mergeMap(result => result === null && data.profilePicture
        ? this.profileService.updateProfilePicture(data.profilePicture).pipe(
          map(success => success ? null : 'picture-bad' as Failure),
          catchError(() => of('picture-unknown' as Failure))
        )
        : of(result)
      ),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: failure => this.generalInformationResult.set(failure === null || FAILURE_MAPPINGS[failure]),
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

  deleteUser(): void {
    const titleKey = 'PROFILE.DELETE_ACCOUNT_CONFIRM_TITLE';
    const descriptionKey = 'PROFILE.DELETE_ACCOUNT_CONFIRM_DESCRIPTION';

    this.dialogService.openConfirmationDialog(titleKey, descriptionKey, 'danger').pipe(
      filter(result => result === true),
      tap(() => this.loading.set(true)),
      mergeMap(() => this.userService.deleteUser()),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: async () => {
        this.authService.logout();
        await this.router.navigate(['/']);
      },
      error: () => this.deleteError.set(true),
    });
  }

  private beginUpdate(): void {
    this.loading.set(true);
    this.generalInformationResult.set(null);
    this.changePasswordResult.set(null);
    this.deleteError.set(false);
  }

  private withoutProfilePicture(data: UpdateUserInfo): UpdateUserInfo {
    const copy = { ...data };
    delete copy.profilePicture;
    return copy;
  }
}
