import { TableColumn } from './table-column.model';
import { TableConstraint } from './table-constraint.model';

export interface Table {
  name: string;
  columns: TableColumn[];
  constraints: TableConstraint[];
}
