import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataModelField } from '../../models/data-model-node.model';
import { DataModelDataType } from '../../models/data-model-data-type.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTypeNameFieldComponent } from '../data-type-name-field/data-type-name-field.component';

export interface DataTypeDialogData {
  dataTypes: DataModelDataType[];
  targetAttribute: DataModelField;
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
    ReactiveFormsModule,
    DataTypeNameFieldComponent,
  ],
})
export class DataTypeSelectorDialogComponent {
  private matDialogRef = inject(MatDialogRef);
  data = inject<DataTypeDialogData>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control(this.findType(this.data.targetAttribute.typeId)?.name ?? '', [Validators.required]),
  });

  confirm(): void {
    const { name } = this.form.getRawValue();
    const type = this.data.dataTypes.find(e => name === e.name);
    if (!type) {
      this.form.controls.name.setErrors({ incorrect: true });
    } else {
      this.matDialogRef.close(type);
    }
  }

  private findType(id: number): DataModelDataType | undefined {
    return this.data.dataTypes.find(e => e.typeId === id);
  }
}
