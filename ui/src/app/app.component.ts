import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProgressSpinnerComponent } from './shared/components/progress-spinner/progress-spinner.component';
import { TranslateService } from './core/translate/translate.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, finalize } from 'rxjs';
import { ProjectSelectorComponent } from './projects/components/project-selector/project-selector.component';
import { TopBarComponent } from './top-bar.component';
import { RouterOutlet } from '@angular/router';
import { RouteDataService } from './core/routing/route-data.service';
import { ProjectService } from './projects/services/project.service';
import { AlertComponent } from './shared/components/alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    ProjectSelectorComponent,
    TopBarComponent,
    RouterOutlet,
    AlertComponent,
  ],
})
export class AppComponent {
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  private routeData = inject(RouteDataService).routeData;
  showTopBar = computed(() => !this.routeData().disableTopBar);

  constructor() {
    combineLatest([
      inject(TranslateService).setLocale('en_US'),
      inject(ProjectService).loadProjects(),
    ]).pipe(
      takeUntilDestroyed(),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      error: (err: Error) => this.error.set(err.message),
    });
  }
}
