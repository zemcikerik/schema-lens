import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProgressSpinnerComponent } from './shared/components/progress-spinner/progress-spinner.component';
import { TranslateService } from './core/translate/translate.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin, map, mergeMap, of } from 'rxjs';
import { ProjectSelectorComponent } from './projects/components/project-selector/project-selector.component';
import { TopBarComponent } from './top-bar.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RouteDataService } from './core/routing/route-data.service';
import { ProjectService } from './projects/services/project.service';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AuthService } from './core/auth/auth.service';
import { UserIdentifierComponent } from './shared/components/user-identifier/user-identifier.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeLocaleDialogComponent } from './shared/components/change-locale-dialog/change-locale-dialog.component';
import { AdminLinkComponent } from './shared/components/admin-link/admin-link.component';
import { HasRolePipe } from './core/pipes/has-role.pipe';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from './core/translate/translate.pipe';
import { ChangeLocaleButtonComponent } from './shared/components/change-locale-button/change-locale-button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressSpinnerComponent,
    ProjectSelectorComponent,
    TopBarComponent,
    RouterOutlet,
    AlertComponent,
    UserIdentifierComponent,
    AdminLinkComponent,
    HasRolePipe,
    MatButton,
    TranslatePipe,
    RouterLink,
    ChangeLocaleButtonComponent,
  ],
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private matDialog = inject(MatDialog);
  private translateService = inject(TranslateService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  private routeData = inject(RouteDataService).routeData;
  showTopBar = computed(() => !this.routeData().disableTopBar);
  currentUser = this.authService.currentUser;

  constructor() {
    const projectService = inject(ProjectService);

    forkJoin([
      this.translateService.trySetLocaleFromStorageOrDefault(),
      this.authService.attemptAuthFromStorage(),
    ]).pipe(
      map(([, authenticated]) => authenticated),
      mergeMap(authenticated => authenticated ? projectService.loadProjects() : of(null)),
      takeUntilDestroyed(),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      error: (err: Error) => this.error.set(err.message),
    });
  }

  async goToProfile(): Promise<void> {
    await this.router.navigate(['/profile']);
  }

  changeLocale(): void {
    this.matDialog.open(ChangeLocaleDialogComponent);
  }

  async goToHelp(): Promise<void> {
    await this.router.navigate(['/help']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
