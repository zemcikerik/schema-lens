import { Table } from './table.model';
import { TableRelationship } from './table-relationship.model';

export interface TableRelationships {
  tables: Table[];
  relationships: TableRelationship[];
}
