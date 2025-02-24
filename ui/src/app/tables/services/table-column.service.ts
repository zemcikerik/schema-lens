import { Injectable } from '@angular/core';
import { TableColumn } from '../models/table-column.model';
import { Table } from '../models/table.model';
import { TableConstraintType } from '../models/table-constraint.model';

@Injectable({ providedIn: 'root' })
export class TableColumnService {

  getPrimaryKeyColumns(table: Table): TableColumn[] {
    const constraint = table.constraints.find(c => c.type === TableConstraintType.PRIMARY_KEY) ?? null;
    return constraint ? table.columns.filter(column => constraint.columnNames.includes(column.name)) : [];
  }

  getUniqueColumnGroupNamesWithoutPrimaryKey(table: Table): string[][] {
    return table.constraints
      .filter(c => c.type === TableConstraintType.UNIQUE)
      .map(c => c.columnNames);
  }

}
