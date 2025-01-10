import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, USERNAME_REGEX } from './auth.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, map, mergeMap, of } from 'rxjs';
import { LayoutAuthComponent } from '../layouts/layout-auth.component';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '../translate/translate.pipe';
import { FormatGenericValidationErrorsPipe } from '../../shared/pipes/format-generic-validation-errors.pipe';
import { ProjectService } from '../../projects/services/project.service';
import { MatIcon } from '@angular/material/icon';
import {
  ChangeLocaleDialogComponent
} from '../../shared/components/change-locale-dialog/change-locale-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    LayoutAuthComponent,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
    MatAnchor,
    RouterLink,
    MatIconButton,
    MatIcon,
    NgOptimizedImage,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private matDialog = inject(MatDialog);

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(64),
      Validators.pattern(USERNAME_REGEX),
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  login(): void {
    const { username, password } = this.loginForm.value;

    if (this.loginForm.invalid || !username || !password) {
      return;
    }

    this.loading.set(true);
    this.loginForm.disable();

    this.authService.login(username, password).pipe(
      mergeMap(authenticated => authenticated
        ? this.projectService.loadProjects().pipe(map(() => true))
        : of(false)),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loading.set(false);
        this.loginForm.enable();
      }),
    ).subscribe({
      next: async success => {
        if (success) {
          await this.router.navigate(['/project']);
        } else {
          this.error.set('AUTH.ERRORS.CREDENTIALS_WRONG');
        }
      },
      error: () => this.error.set('GENERIC.ERROR_LABEL'),
    });
  }

  changeLocale(): void {
    this.matDialog.open(ChangeLocaleDialogComponent);
  }
}
