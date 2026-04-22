import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const uniqueStringValidator = (values: string[]): ValidatorFn => {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value;
    return value !== null && values.find(v => v.toUpperCase() === value.toUpperCase()) ? { notUnique: true } : null;
  };
};
