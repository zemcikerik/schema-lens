import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormatGenericValidationErrorsPipe } from '../../pipes/format-generic-validation-errors.pipe';

@Component({
  selector: 'app-string-list-field',
  templateUrl: './string-list-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatError,
    MatFormField,
    MatIconModule,
    MatInput,
    MatLabel,
    FormatGenericValidationErrorsPipe,
  ],
})
export class StringListFieldComponent {
  control = input.required<FormControl<string[]>>();
  label = input.required<string>();
  placeholder = input<string>('');
  separatorKeyCodes = input<number[]>([ENTER, COMMA]);
  addOnBlur = input<boolean>(true);

  required = computed(() => this.control().hasValidator(Validators.required));

  addItem(event: MatChipInputEvent): void {
    const value = this.normalizeValue(event.value);

    if (value) {
      this.setItems([...this.control().value, value]);
    } else {
      this.control().markAsTouched();
    }

    event.chipInput?.clear();
  }

  editItem(index: number, event: MatChipEditedEvent): void {
    const value = this.normalizeValue(event.value);

    if (!value) {
      this.removeItem(index);
      return;
    }

    this.setItems(this.control().value.map((item, i) => (i === index ? value : item)));
  }

  removeItem(index: number): void {
    this.setItems(this.control().value.filter((_, i) => i !== index));
  }

  private normalizeValue(value: string): string {
    return value.trim();
  }

  private setItems(items: string[]): void {
    const control = this.control();
    control.setValue(items);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
  }
}
