import { Pipe, PipeTransform } from '@angular/core';
import { TableConstraintType } from '../models/table-constraint.model';

@Pipe({
  name: 'constraintTypeToLabel',
  pure: true,
})
export class ConstraintTypeToLabelPipe implements PipeTransform {

  transform(value: TableConstraintType | `${TableConstraintType}`): string {
    return `TABLES.CONSTRAINTS.TYPE.${value}`;
  }

}
