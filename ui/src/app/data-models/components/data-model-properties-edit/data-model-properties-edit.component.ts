import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DataModelService } from '../../services/data-model.service';
import { DataModelStore } from '../../data-model.store';
import { catchError, filter, finalize, of, switchMap, tap } from 'rxjs';
import { DataModelPropertiesFormComponent } from '../data-model-properties-form/data-model-properties-form.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DialogService } from '../../../core/dialog.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DataModel } from '../../models/data-model.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-model-properties-edit',
  template: `
    <app-layout-header-and-content [title]="('DATA_MODEL.PROPERTIES.TITLE' | translate)()"
                                   [includeSpacing]="loading() || error()">
      @if (loading()) {
        <app-progress-spinner [center]="true" />
      } @else if (error()) {
        <app-alert type="error">{{ ('GENERIC.ERROR_LABEL' | translate)() }}</app-alert>
      } @else {
        <app-data-model-properties-form [properties]="properties()" (delete)="deleteDataModel()"
                                        (save)="updateProperties($event)" />
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
  dataModelId = input.required<string>();
  properties = signal<DataModel | null>(null);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  private dialogService = inject(DialogService);
  private dataModelService = inject(DataModelService);
  private dataModelStore = inject(DataModelStore);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  constructor() {
    toObservable(this.dataModelId).pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(false);
      }),
      switchMap(() =>
        this.dataModelService.getDataModel(+this.dataModelId()).pipe(
          finalize(() => this.loading.set(false)),
          catchError(() => {
            this.error.set(true);
            return of(null);
          }),
        ),
      ),
      takeUntilDestroyed(),
    ).subscribe(properties => {
      this.properties.set(properties);
    });
  }

  updateProperties(properties: DataModel): void {
    this.loading.set(true);

    this.dataModelStore
      .updateProperties(properties)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: properties => this.properties.set(properties),
        error: () => this.error.set(true),
      });
  }

  deleteDataModel(): void {
    const dataModelId = +this.dataModelId();

    this.dialogService
      .openConfirmationDialog('GENERIC.CONFIRM_LABEL', 'DATA_MODEL.DELETE_CONFIRM_DESCRIPTION', 'danger')
      .pipe(
        filter(r => r === true),
        tap(() => this.loading.set(true)),
        switchMap(() => this.dataModelService.deleteDataModel(dataModelId)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: async () => await this.router.navigate(['/model']),
        error: () => this.error.set(true),
      });
  }
}
