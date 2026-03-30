import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { combineLatest, map, startWith, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { DataModelDataType } from '../../models/data-model-types.model';

@Component({
  selector: 'app-data-type-name-field',
  templateUrl: './data-type-name-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    MatError,
    FormatGenericValidationErrorsPipe,
  ],
})
export class DataTypeNameFieldComponent {
  dataTypes = input.required<DataModelDataType[]>();
  control = input.required<FormControl<string>>();
  label = input.required<string>();

  private dataTypes$ = toObservable(this.dataTypes);

  filteredTypes = toSignal(
    toObservable(this.control).pipe(
      switchMap(ctrl => combineLatest([ctrl.valueChanges.pipe(startWith(ctrl.value)), this.dataTypes$])),
      map(([value, dataTypes]) => dataTypes.filter(t => t.name.toUpperCase().startsWith(value.toUpperCase()))),
    ),
    { initialValue: [] as DataModelDataType[] },
  );
}
