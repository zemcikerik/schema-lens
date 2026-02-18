import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { DataModelService } from '../../services/data-model.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { finalize } from 'rxjs';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataModel } from '../../models/data-model.model';
import { DataModelPropertiesFormComponent } from '../data-model-properties-form/data-model-properties-form.component';

@Component({
  selector: 'app-project-create',
  template: `
    <app-content-card>
      <app-layout-header-and-content title="Create new model" [includeSpacing]="loading() || error()">
        @if (loading()) {
          <app-progress-spinner [center]="true" />
        } @else if (error()) {
          <app-alert type="error">{{ ('GENERIC.ERROR_LABEL' | translate)() }}</app-alert>
        } @else {
          <app-data-model-properties-form (save)="createDataModel($event)" />
        }
      </app-layout-header-and-content>
    </app-content-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContentCardComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
    LayoutHeaderAndContentComponent,
    AlertComponent,
    DataModelPropertiesFormComponent,
  ],
})
export class DataModelCreateComponent {
  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private dataModelService = inject(DataModelService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  createDataModel(dataModel: DataModel): void {
    this.loading.set(true);

    this.dataModelService
      .createDataModel(dataModel)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.router.navigate(['/model']),
        error: () => this.error.set(true),
      });
  }
}
