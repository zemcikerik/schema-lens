import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateService } from './core/translate/translate.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { LayoutMainComponent } from './layout-main.component';
import { ProjectSelectorComponent } from './projects/components/project-selector/project-selector.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinner,
    LayoutMainComponent,
    ProjectSelectorComponent,
  ],
})
export class AppComponent {

  coreDataLoaded = signal(false);

  constructor() {
    inject(TranslateService).setLanguage('en').pipe(
      delay(1500),
      takeUntilDestroyed(),
    ).subscribe(() => this.coreDataLoaded.set(true));
  }

}
