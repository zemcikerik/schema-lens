import { Injectable } from '@angular/core';
import { TableColumn } from '../models/table-column.model';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableColumnService {

  getPrimaryKeyColumns(table: Table): TableColumn[] {
    const constraint = table.constraints.find(c => c.type === 'primary-key') ?? null;
    return constraint ? table.columns.filter(column => constraint.columnNames.includes(column.name)) : [];
  }

}
