import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { DataModelEdgeField } from '../../models/data-model-edge.model';
import { dataModelFieldNameValidators } from '../../validators/data-model-name.validators';

export interface DataModelEdgeFieldFormDialogData {
  field: DataModelEdgeField;
  existingFieldNames: string[];
}

@Component({
  selector: 'app-data-model-edge-field-form-dialog',
  templateUrl: './data-model-edge-field-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    FormatGenericValidationErrorsPipe,
    TranslatePipe,
  ],
})
export class DataModelEdgeFieldFormDialogComponent {
  private matDialogRef = inject(MatDialogRef<DataModelEdgeFieldFormDialogComponent, DataModelEdgeField>);
  readonly data = inject<DataModelEdgeFieldFormDialogData>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(
      this.data.field.name,
      dataModelFieldNameValidators(this.data.existingFieldNames),
    ),
  });

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.matDialogRef.close({ ...this.data.field, name: this.form.getRawValue().name });
  }

  cancel(): void {
    this.matDialogRef.close(undefined);
  }
}
