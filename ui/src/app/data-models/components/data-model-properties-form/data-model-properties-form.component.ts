import { ChangeDetectionStrategy, Component, effect, input, output, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { DataModel } from '../../models/data-model.model';

@Component({
  selector: 'app-data-model-properties-form',
  templateUrl: './data-model-properties-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    MatIcon,
    MatInput,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
  ],
})
export class DataModelPropertiesFormComponent {
  properties = input<DataModel | null>(null);
  save = output<DataModel>();
  delete = output();

  propertiesForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(64)]),
  });

  constructor() {
    effect(() => {
      const properties = this.properties();
      untracked(() => {
        if (properties !== null) {
          this.propertiesForm.patchValue({
            name: properties.name,
          });
        }
      });
    });
  }

  submit(): void {
    if (this.propertiesForm.valid) {
      const { name } = this.propertiesForm.value;

      this.save.emit({
        id: this.properties()?.id ?? null,
        name: name as string,
      });
    }
  }

  get nameControl() {
    return this.propertiesForm.controls.name;
  }
}
