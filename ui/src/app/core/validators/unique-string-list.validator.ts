import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const uniqueStringListValidator: ValidatorFn = (control: AbstractControl<string[] | null>): ValidationErrors | null => {
  const values = control.value ?? [];
  const normalizedValues = values.map(value => value.toUpperCase());
  const uniqueValuesCount = new Set(normalizedValues).size;

  return normalizedValues.length !== uniqueValuesCount ? { notUnique: true } : null;
};
