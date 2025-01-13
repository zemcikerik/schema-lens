import { AbstractControl, ValidatorFn } from '@angular/forms';

const NO_START_END_WHITESPACE_REGEX = /^(\S.*\S|\S)$/s;

export const noStartEndWhitespaceValidator: ValidatorFn = (control: AbstractControl) =>
  control.value && !NO_START_END_WHITESPACE_REGEX.test(control.value) ? { noStartEndWhitespace: true } : null;
