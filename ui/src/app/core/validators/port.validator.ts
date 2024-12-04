import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const portValidator: ValidatorFn = (control: AbstractControl<number | null>): ValidationErrors | null => {
  const value = control.value;

  if (value === null) {
    return null;
  }

  return value >= 1 && value <= 65535 ? null : { port: true };
};
