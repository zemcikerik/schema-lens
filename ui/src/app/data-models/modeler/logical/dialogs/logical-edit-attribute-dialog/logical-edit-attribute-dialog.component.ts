import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../../../core/translate/translate.pipe';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { ProgressSpinnerComponent } from '../../../../../shared/components/progress-spinner/progress-spinner.component';
import { FormatGenericValidationErrorsPipe } from '../../../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../../../core/validators/no-start-end-whitespace.validator';
import { DataModelField } from '../../../../models/data-model-node.model';
import { DataModelDataType } from '../../../../models/data-model-data-type.model';
import { DataTypeNameFieldComponent } from '../../../../components/data-type-name-field/data-type-name-field.component';

export interface LogicalEditAttributeDialogData {
  attribute: DataModelField;
  dataTypes: DataModelDataType[];
}

@Component({
  selector: 'app-logical-edit-attribute-dialog',
  templateUrl: './logical-edit-attribute-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    MatError,
    ReactiveFormsModule,
    TranslatePipe,
    AlertComponent,
    ProgressSpinnerComponent,
    FormatGenericValidationErrorsPipe,
    DataTypeNameFieldComponent,
  ],
})
export class LogicalEditAttributeDialogComponent {
  private matDialogRef = inject(MatDialogRef<LogicalEditAttributeDialogComponent, DataModelField>);
  readonly data = inject<LogicalEditAttributeDialogData>(MAT_DIALOG_DATA);

  loading = signal(false);
  error = signal(false);

  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.data.attribute.name, [
      Validators.required,
      Validators.maxLength(40),
      noStartEndWhitespaceValidator,
    ]),
    typeName: this.fb.nonNullable.control(
      this.data.dataTypes.find(t => t.typeId === this.data.attribute.typeId)?.name ?? '',
      [Validators.required],
    ),
    isPrimaryKey: this.fb.nonNullable.control(this.data.attribute.isPrimaryKey),
    isNullable: this.fb.nonNullable.control({
      value: this.data.attribute.isNullable,
      disabled: this.data.attribute.isPrimaryKey,
    }),
  });

  constructor() {
    const { isPrimaryKey, isNullable } = this.form.controls;

    isPrimaryKey.valueChanges.pipe(takeUntilDestroyed()).subscribe(isPrimaryKey => {
      if (isPrimaryKey) {
        isNullable.setValue(false);
        isNullable.disable();
      } else {
        isNullable.enable();
      }
    });
  }

  // TODO: multiple with the same name?
  confirm(): void {
    const { name, typeName, isPrimaryKey, isNullable } = this.form.getRawValue();
    const type = this.data.dataTypes.find(t => t.name === typeName);

    if (!type) {
      this.form.controls.typeName.setErrors({ incorrect: true });
      return;
    }

    const updated: DataModelField = {
      ...this.data.attribute,
      name,
      typeId: type.typeId as number,
      isPrimaryKey,
      isNullable: isPrimaryKey ? false : isNullable,
    };

    this.matDialogRef.close(updated);
  }

  cancel(): void {
    this.matDialogRef.close(undefined);
  }
}
