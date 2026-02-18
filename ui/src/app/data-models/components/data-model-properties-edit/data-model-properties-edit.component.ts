import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DataModelService } from '../../services/data-model.service';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { DataModelPropertiesFormComponent } from '../data-model-properties-form/data-model-properties-form.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DialogService } from '../../../core/dialog.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DataModel } from '../../models/data-model.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-properties-edit',
  template: `
    <app-layout-header-and-content [title]="('DATAMODEL.PROPERTIES.TITLE' | translate)()" [includeSpacing]="loading() || error()">
      @if (loading()) {
      <app-progress-spinner [center]="true" />
      } @else if (error()) {
      <app-alert type="error">{{ ('GENERIC.ERROR_LABEL' | translate)() }}</app-alert>
      } @else if (dataModel()) {
      <app-data-model-properties-form [properties]="dataModel()" (delete)="deleteDataModel()" (save)="updateProperties($event)" />
      }
    </app-layout-header-and-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataModelPropertiesFormComponent,
    TranslatePipe,
    ProgressSpinnerComponent,
    LayoutHeaderAndContentComponent,
    AlertComponent,
  ],
})
export class DataModelPropertiesEditComponent {
  dataModelId = input.required<number>();

  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  private dialogService = inject(DialogService);
  private dataModelService = inject(DataModelService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  initSig = toSignal(
    toObservable(this.dataModelId).pipe(
      switchMap(() =>
        this.dataModelService.getDataModel(this.dataModelId()).pipe(
          finalize(() => this.loading.set(false)),
          tap({
            error: () => {
              this.error.set(true);
            },
          }),
        ),
      ),
    ),
  );

  dataModel = linkedSignal(() => this.initSig() ?? null);

  updateProperties(properties: DataModel): void {
    this.dataModelService
      .updateDataModel(properties)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: properties => this.dataModel.set(properties),
        error: () => this.error.set(true),
      });
  }

  deleteDataModel(): void {
    const dataModelId = this.dataModelId();

    this.dialogService
      .openConfirmationDialog('GENERIC.CONFIRM_LABEL', 'DATAMODEL.DELETE_DESCRIPTION', 'danger')
      .pipe(
        filter(r => r === true),
        tap(async () => {
          this.loading.set(true);
          this.error.set(false);
          await this.router.navigate(['/model']);
        }),
        switchMap(() => this.dataModelService.deleteDataModel(dataModelId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () => this.error.set(true),
      });
  }
}
