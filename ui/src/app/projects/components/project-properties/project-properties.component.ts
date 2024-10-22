import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-project-properties',
  templateUrl: './project-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class ProjectPropertiesComponent {
  formGroup = new FormGroup({
    mainProperties: new FormGroup({
      name: new FormControl('Test Project Name', [Validators.required]),
      dbType: new FormControl('oracle', [Validators.required]),
    }),
    connection: new FormGroup({
      host: new FormControl('example.com', [Validators.required]),
      port: new FormControl('1433', [Validators.required, Validators.min(1), Validators.max(65535)]),
      service: new FormControl('FREEPDB1', [Validators.required]),
      username: new FormControl('username', [Validators.required]),
      password: new FormControl('dummy', [Validators.required])
    })
  });
}
