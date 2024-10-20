import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateService } from './core/translate/translate.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { ProjectSelectorComponent } from './projects/components/project-selector/project-selector.component';
import { TopBarComponent } from './top-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressSpinner,
    ProjectSelectorComponent,
    TopBarComponent,
    RouterOutlet,
  ],
})
export class AppComponent {

  coreDataLoaded = signal(false);

  constructor() {
    inject(TranslateService).setLocale('en_US').pipe(
      delay(1500),
      takeUntilDestroyed(),
    ).subscribe(() => this.coreDataLoaded.set(true));
  }

}
