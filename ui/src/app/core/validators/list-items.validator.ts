import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const listItemsValidator =
  <T>(validator: ValidatorFn): ValidatorFn =>
  (control: AbstractControl<T[] | null>): ValidationErrors | null => {
    const errors = (control.value ?? [])
      .map(value => validator(new FormControl<T>(value)))
      .filter((value): value is ValidationErrors => value !== null);

    return errors.length > 0 ? Object.assign({}, ...errors) : null;
  };
