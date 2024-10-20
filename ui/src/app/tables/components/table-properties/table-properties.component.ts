import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-table-properties',
  templateUrl: './table-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatError,
    ReactiveFormsModule,
  ],
})
export class TablePropertiesComponent {
  propertiesFormGroup = new FormGroup({
    name: new FormControl('Default name', [Validators.required]),
    tablespace: new FormControl('USERS', [Validators.required]),
    description: new FormControl('')
  });
}
