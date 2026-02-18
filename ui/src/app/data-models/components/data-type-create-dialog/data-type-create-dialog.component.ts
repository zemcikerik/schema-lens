import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DataType } from '../../models/logical-model.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataTypeService } from '../../services/data-type.service';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../../core/validators/unique-string.validator';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';

export interface DataTypeCreateDialogData {
  modelId: number;
  dataTypes: DataType[];
}

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
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    AlertComponent,
    ProgressSpinnerComponent,
    FormatGenericValidationErrorsPipe,
  ],
})
export class DataTypeCreateDialogComponent {
  private matDialogRef = inject(MatDialogRef);

  data = inject<DataTypeCreateDialogData>(MAT_DIALOG_DATA);
  dataTypeService = inject(DataTypeService);

  loading = signal<boolean>(false);
  error = signal<boolean>(false);

  formControl = new FormControl<string>('', [
    Validators.required,
    noStartEndWhitespaceValidator,
    Validators.maxLength(40),
    uniqueStringValidator(this.data.dataTypes.map(d => d.name)),
  ]);

  confirm = () => {
    const name = this.formControl.value;
    if (!name) return;
    this.loading.set(true);
    this.error.set(false);
    this.dataTypeService.createDataType(this.data.modelId, { name: name.toUpperCase(), typeId: null }).subscribe({
      next: res => {
        this.loading.set(false);
        this.matDialogRef.close(res);
      },
      error: () => {
        this.error.set(true);
      },
    });
  };
}
