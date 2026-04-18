import { ValidatorFn, Validators } from '@angular/forms';
import { noStartEndWhitespaceValidator } from '../../core/validators/no-start-end-whitespace.validator';
import { uniqueStringValidator } from '../../core/validators/unique-string.validator';

export const dataModelDiagramNameValidators = (): ValidatorFn[] => [
  Validators.required,
  noStartEndWhitespaceValidator,
  Validators.maxLength(64),
];

export const dataModelNodeNameValidators = (existingNames: string[]): ValidatorFn[] => [
  Validators.required,
  noStartEndWhitespaceValidator,
  Validators.maxLength(30),
  uniqueStringValidator(existingNames),
];

export const dataModelDataTypeNameValidators = (existingNames: string[]): ValidatorFn[] => [
  Validators.required,
  noStartEndWhitespaceValidator,
  Validators.maxLength(40),
  uniqueStringValidator(existingNames),
];
