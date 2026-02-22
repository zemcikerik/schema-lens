import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LayoutContentWithSidebarComponent } from '../core/layouts/layout-content-with-sidebar.component';
import { ContentCardComponent } from '../shared/components/content-card/content-card.component';
import { DataModelNavComponent } from './components/data-model-nav/data-model-nav.component';
import { Router, RouterOutlet } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ProgressSpinnerComponent } from '../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../shared/components/alert/alert.component';
import { TranslatePipe } from '../core/translate/translate.pipe';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { LogicalModelStore } from './modeler/logical/logical-model.store';
import { DataModelDialogService } from './services/data-model-dialog.service';

@Component({
  selector: 'app-data-model',
  templateUrl: './data-model.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutContentWithSidebarComponent,
    ContentCardComponent,
    DataModelNavComponent,
    RouterOutlet,
    ProgressSpinnerComponent,
    AlertComponent,
    TranslatePipe,
  ],
  providers: [
    LogicalModelStore,
    DataModelDialogService,
  ],
})
export class DataModelComponent {
  dataModelId = input.required<string>();
  numericDataModelId = computed<number>(() => {
    const id = +this.dataModelId();

    if (!isNaN(id)) {
      return id;
    }

    this.redirectTo404();
    return -1;
  });

  store = inject(LogicalModelStore);
  private router = inject(Router);

  constructor() {
    toObservable(this.numericDataModelId)
      .pipe(
        switchMap(id => this.store.loadModel(id)),
        tap(model => {
          if (model === null) {
            this.redirectTo404();
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private async redirectTo404(): Promise<void> {
    await this.router.navigate(['/404']);
  }
}
