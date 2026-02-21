import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataType, LogicalAttribute } from '../../models/logical-model.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataTypeService } from '../../services/data-type.service';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export interface DataTypeDialogData {
  dataTypes: DataType[];
  targetAttribute: LogicalAttribute;
}

// TODO: refactor similarly to data-type-create-dialog

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
    FormsModule,
    MatInputModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class DataTypeSelectorDialogComponent {
  private matDialogRef = inject(MatDialogRef);
  data = inject<DataTypeDialogData>(MAT_DIALOG_DATA);
  dataTypeService = inject(DataTypeService);

  findType = (id: number) => this.data.dataTypes.find(e => e.typeId === id);

  formControl = new FormControl<string>(this.findType(this.data.targetAttribute.typeId)?.name ?? '');
  filteredTypes = this.formControl.valueChanges.pipe(
    startWith(''),
    map(value => this.data.dataTypes.filter(d => d.name.toUpperCase().startsWith(value?.toUpperCase() ?? ''))),
  );

  confirm = () => {
    if (!this.formControl.value) return;
    const val = this.formControl.value;
    const type = this.data.dataTypes.find(e => val === e.name);
    if (!type) this.formControl.setErrors({ incorrect: true });
    else this.matDialogRef.close(type);
  };
}
