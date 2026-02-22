import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LogicalAttribute, LogicalDataType } from '../../models/logical-model.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';

export interface DataTypeDialogData {
  dataTypes: LogicalDataType[];
  targetAttribute: LogicalAttribute;
}

@Component({
  selector: 'app-data-type-selector-dialog',
  templateUrl: './data-type-selector-dialog.component.html',
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
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    ReactiveFormsModule,
    MatError,
    FormatGenericValidationErrorsPipe,
  ],
})
export class DataTypeSelectorDialogComponent {
  private matDialogRef = inject(MatDialogRef);
  data = inject<DataTypeDialogData>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.findType(this.data.targetAttribute.typeId)?.name ?? '', [Validators.required]),
  });

  filteredTypes = toSignal(
    this.form.controls.name.valueChanges.pipe(
      startWith(this.form.controls.name.value),
      map(value => this.data.dataTypes.filter(d => d.name.toUpperCase().startsWith(value?.toUpperCase() ?? ''))),
    ),
    { initialValue: this.data.dataTypes },
  );

  confirm(): void {
    const { name } = this.form.getRawValue();
    const type = this.data.dataTypes.find(e => name === e.name);
    if (!type) {
      this.form.controls.name.setErrors({ incorrect: true });
    } else {
      this.matDialogRef.close(type);
    }
  }

  private findType(id: number): LogicalDataType | undefined {
    return this.data.dataTypes.find(e => e.typeId === id);
  }
}
