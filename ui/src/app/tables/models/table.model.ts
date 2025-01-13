import { TableColumn } from './table-column.model';
import { TableConstraint } from './table-constraint.model';
import { TableIndex } from './table-index.model';

export interface Table {
  name: string;
  columns: TableColumn[];
  constraints: TableConstraint[];
  indexes: TableIndex[];
}
