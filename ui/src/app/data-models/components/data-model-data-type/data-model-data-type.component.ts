import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { DataModelDataType } from '../../models/data-model-data-type.model';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogService } from '../../../core/dialog.service';
import { DataModelStore } from '../../data-model.store';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import {
  SaveDeleteControlComponent
} from '../../../shared/components/save-delete-control/save-delete-control.component';
import { DataModelingTranslationKeyResolver } from '../../services/data-modeling-translation-key-resolver.service';

@Component({
  selector: 'app-data-model-data-type',
  templateUrl: './data-model-data-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatInput,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
    LayoutHeaderAndContentComponent,
    AlertComponent,
    MatFormField,
    MatLabel,
    MatError,
    SectionHeaderComponent,
    SaveDeleteControlComponent,
  ],
})
export class DataModelDataTypeComponent {
  dataTypeId = input.required<string>();
  updateLoading = signal<boolean>(false);
  deleteLoading = signal<boolean>(false);
  loading = computed<boolean>(() => this.updateLoading() || this.deleteLoading());
  error = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private store = inject(DataModelStore);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private keyResolver = inject(DataModelingTranslationKeyResolver);

  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(40)]),
  });

  dataType = computed<DataModelDataType | null>(() => {
    const typeId = +this.dataTypeId();
    return this.store.dataTypes().find(type => type.typeId === typeId) ?? null;
  });

  constructor() {
    effect(() => {
      const dataType = this.dataType();

      if (dataType !== null) {
        this.propertiesForm.reset({ name: dataType.name });
        return;
      }

      if (!this.loading()) {
        this.redirectToModel();
      }
    });
  }

  updateDataType(): void {
    if (this.propertiesForm.invalid) {
      this.propertiesForm.markAllAsTouched();
      return;
    }

    const typeId = this.dataType()?.typeId;

    if (typeId == null) {
      return;
    }

    const { name } = this.propertiesForm.getRawValue();

    this.updateLoading.set(true);
    this.error.set(null);

    this.store
      .updateDataType({ typeId, name })
      .pipe(
        finalize(() => this.updateLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () => this.error.set('GENERIC.ERROR_LABEL'),
      });
  }

  deleteDataType(): void {
    const typeId = this.dataType()?.typeId;

    if (typeId == null) {
      return;
    }

    this.dialogService
      .openConfirmationDialog('DATA_MODEL.DATA_TYPE.DELETE_TITLE', 'DATA_MODEL.DATA_TYPE.DELETE_DESCRIPTION', 'danger')
      .pipe(
        filter(result => result === true),
        tap(() => {
          this.deleteLoading.set(true);
          this.error.set(null);
        }),
        switchMap(() => this.store.deleteDataType(typeId)),
        finalize(() => this.deleteLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: async result => {
          if (result === false) {
            this.error.set(this.keyResolver.resolveKey('DATA_MODEL.DATA_TYPE.ERROR.$layer.IN_USE'));
            return;
          }

          await this.redirectToModel();
        },
        error: () => this.error.set('GENERIC.ERROR_LABEL'),
      });
  }

  get nameControl() {
    return this.propertiesForm.controls.name;
  }

  private async redirectToModel(): Promise<void> {
    await this.router.navigate(['/model', this.store.dataModelId]);
  }
}
