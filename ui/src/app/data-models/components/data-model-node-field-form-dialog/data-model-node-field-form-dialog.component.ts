import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { DataModelDataTypeNameFieldComponent } from '../data-model-data-type-name-field/data-model-data-type-name-field.component';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { DataModelDataType } from '../../models/data-model-data-type.model';
import { DataModelField } from '../../models/data-model-node.model';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

export interface DataModelNodeFieldFormDialogData {
  field: DataModelField | null;
  dataTypes: DataModelDataType[];
}

@Component({
  selector: 'app-data-model-node-field-form-dialog',
  templateUrl: './data-model-node-field-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatError,
    MatButton,
    DataModelDataTypeNameFieldComponent,
    FormatGenericValidationErrorsPipe,
    DataModelingTranslatePipe,
    TranslatePipe,
  ],
})
export class DataModelNodeFieldFormDialogComponent {
  private matDialogRef = inject(MatDialogRef<DataModelNodeFieldFormDialogComponent, DataModelField>);
  readonly data = inject<DataModelNodeFieldFormDialogData>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.data.field?.name ?? '', [
      Validators.required,
      Validators.maxLength(40),
      noStartEndWhitespaceValidator,
    ]),
    typeName: this.fb.nonNullable.control(this.data.dataTypes.find(type => type.typeId === this.data.field?.typeId)?.name ?? '', [
      Validators.required,
    ]),
    isPrimaryKey: this.fb.nonNullable.control(this.data.field?.isPrimaryKey ?? false),
    isNullable: this.fb.nonNullable.control({
      value: this.data.field?.isNullable ?? true,
      disabled: this.data.field?.isPrimaryKey ?? false,
    }),
  });

  constructor() {
    const { isPrimaryKey, isNullable } = this.form.controls;

    isPrimaryKey.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (value) {
        isNullable.setValue(false);
        isNullable.disable();
      } else {
        isNullable.enable();
      }
    });
  }

  confirm(): void {
    if (this.form.invalid) {
      return;
    }

    const { name, typeName, isPrimaryKey, isNullable } = this.form.getRawValue();
    const type = this.data.dataTypes.find(t => t.name === typeName);

    if (!type || type.typeId === null) {
      return;
    }

    this.matDialogRef.close({
      ...this.data.field,
      name,
      typeId: type.typeId,
      isPrimaryKey,
      isNullable: isPrimaryKey ? false : isNullable,
    });
  }

  cancel(): void {
    this.matDialogRef.close(undefined);
  }
}
