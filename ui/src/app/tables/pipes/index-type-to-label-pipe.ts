import { Pipe, PipeTransform } from '@angular/core';
import { TableIndexType } from '../models/table-index.model';

@Pipe({
  name: 'indexTypeToLabel',
  standalone: true,
  pure: true
})
export class IndexTypeToLabelPipe implements PipeTransform {

  transform(type: TableIndexType): string {
    return `TABLES.INDEXES.TYPE.${type}`;
  }

}
