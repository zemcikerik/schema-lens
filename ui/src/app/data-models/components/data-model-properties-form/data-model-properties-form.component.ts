import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';
import { DataModel } from '../../models/data-model.model';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import {
  SaveDeleteControlComponent
} from '../../../shared/components/save-delete-control/save-delete-control.component';

@Component({
  selector: 'app-data-model-properties-form',
  templateUrl: './data-model-properties-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
    SectionHeaderComponent,
    SaveDeleteControlComponent,
  ],
})
export class DataModelPropertiesFormComponent {
  properties = input<DataModel | null>(null);
  save = output<DataModel>();
  delete = output();

  private fb = inject(FormBuilder);
  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(64)]),
  });

  constructor() {
    toObservable(this.properties)
      .pipe(takeUntilDestroyed())
      .subscribe(properties => {
        if (properties !== null) {
          this.propertiesForm.reset(properties);
        } else {
          this.propertiesForm.reset();
        }
      });
  }

  submit(): void {
    if (this.propertiesForm.invalid) {
      this.propertiesForm.markAllAsTouched();
      return;
    }

    const { name } = this.propertiesForm.getRawValue();

    this.save.emit({
      id: this.properties()?.id ?? null,
      name: name,
    });
  }

  get nameControl() {
    return this.propertiesForm.controls.name;
  }
}
