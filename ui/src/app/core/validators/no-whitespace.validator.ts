import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const WHITESPACE_REGEX = /\s/;

export const noWhitespaceValidator: ValidatorFn = (control: AbstractControl<string | null>): ValidationErrors | null =>
  control.value && WHITESPACE_REGEX.test(control.value) ? { noWhitespace: true } : null;
