import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProgressSpinnerComponent } from './shared/components/progress-spinner/progress-spinner.component';
import { TranslateService } from './core/translate/translate.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { ProjectSelectorComponent } from './projects/components/project-selector/project-selector.component';
import { TopBarComponent } from './top-bar.component';
import { RouterOutlet } from '@angular/router';
import { RouteDataService } from './core/routing/route-data.service';

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
  ],
})
export class AppComponent {

  coreDataLoaded = signal(false);

  private routeData = inject(RouteDataService).routeData;
  showTopBar = computed(() => !this.routeData().disableTopBar);

  constructor() {
    inject(TranslateService).setLocale('en_US').pipe(
      delay(1500),
      takeUntilDestroyed(),
    ).subscribe(() => this.coreDataLoaded.set(true));
  }

}
