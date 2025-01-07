import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const verifyPasswordValidator = (passwordControl: FormControl<string | null>): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => passwordControl.value !== control.value ? { verifyPassword: true } : null;
