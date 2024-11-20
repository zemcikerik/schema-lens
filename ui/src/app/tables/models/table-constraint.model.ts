export type TableConstraintType = 'primary-key' | 'foreign-key' | 'unique' | 'check';

interface BaseTableConstraint {
  name: string;
  type: TableConstraintType;
  columnNames: string[];
}

export interface PrimaryKeyTableConstraint extends BaseTableConstraint {
  type: 'primary-key';
}

export interface ForeignKeyTableConstraint extends BaseTableConstraint {
  type: 'foreign-key';
  referencedConstraintName: string;
  referencedTableName: string;
  references: ForeignKeyColumnReference[];
}

export interface UniqueTableConstraint extends BaseTableConstraint {
  type: 'unique';
}

export interface CheckTableConstraint extends BaseTableConstraint {
  type: 'check';
  condition: string;
}

export type TableConstraint =
  PrimaryKeyTableConstraint
  | ForeignKeyTableConstraint
  | UniqueTableConstraint
  | CheckTableConstraint;

export interface ForeignKeyColumnReference {
  columnName: string;
  referencedColumnName: string;
}
