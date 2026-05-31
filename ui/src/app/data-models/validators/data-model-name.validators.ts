import { ValidatorFn, Validators } from '@angular/forms';
import { listItemsValidator } from '../../core/validators/list-items.validator';
import { noStartEndWhitespaceValidator } from '../../core/validators/no-start-end-whitespace.validator';
import { noWhitespaceValidator } from '../../core/validators/no-whitespace.validator';
import { uniqueStringValidator } from '../../core/validators/unique-string.validator';
import { uniqueStringListValidator } from '../../core/validators/unique-string-list.validator';

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

export const dataModelFieldNameValidators = (existingNames: string[]): ValidatorFn[] => [
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

export const dataModelDataTypeParameterValidators = (): ValidatorFn[] => [
  uniqueStringListValidator,
  listItemsValidator<string>(noWhitespaceValidator),
  listItemsValidator<string>(Validators.maxLength(38)),
];
