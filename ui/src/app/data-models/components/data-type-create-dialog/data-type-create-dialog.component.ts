import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { LogicalDataType } from '../../models/logical-model.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { LogicalModelStore } from '../../modeler/logical/logical-model.store';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../../core/validators/unique-string.validator';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface DataTypeCreateDialogData {
  dataTypes: LogicalDataType[];
}

// TODO: inconsistent naming
@Component({
  selector: 'app-data-type-create-dialog',
  templateUrl: './data-type-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    AlertComponent,
    ProgressSpinnerComponent,
    FormatGenericValidationErrorsPipe,
    MatError,
  ],
})
export class DataTypeCreateDialogComponent {
  private matDialogRef = inject(MatDialogRef);
  private destroyRef = inject(DestroyRef);

  data = inject<DataTypeCreateDialogData>(MAT_DIALOG_DATA);
  private store = inject(LogicalModelStore);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [
      Validators.required,
      noStartEndWhitespaceValidator,
      Validators.maxLength(40),
      uniqueStringValidator(this.data.dataTypes.map(d => d.name)),
    ]),
  });

  confirm(): void {
    const { name } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(false);
    this.matDialogRef.disableClose = true;

    this.store.createDataType({ name: name, typeId: null })
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.matDialogRef.disableClose = false;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: dataType => this.matDialogRef.close(dataType),
        error: () => this.error.set(true),
      });
  }
}
