import { Pipe, PipeTransform } from '@angular/core';
import { TableConstraintType } from '../models/table-constraint.model';

@Pipe({
  name: 'constraintTypeToLabel',
  standalone: true,
  pure: true,
})
export class ConstraintTypeToLabelPipe implements PipeTransform {

  transform(value: TableConstraintType): string {
    return `TABLES.CONSTRAINTS.TYPE.${value.toUpperCase()}`;
  }

}
