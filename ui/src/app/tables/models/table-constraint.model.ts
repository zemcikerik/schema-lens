export enum TableConstraintType {
  PRIMARY_KEY = 'PRIMARY_KEY',
  FOREIGN_KEY = 'FOREIGN_KEY',
  UNIQUE = 'UNIQUE',
  CHECK = 'CHECK',
}

interface BaseTableConstraint {
  name: string;
  type: TableConstraintType;
  columnNames: string[];
}

export interface PrimaryKeyTableConstraint extends BaseTableConstraint {
  type: TableConstraintType.PRIMARY_KEY;
}

export interface ForeignKeyTableConstraint extends BaseTableConstraint {
  type: TableConstraintType.FOREIGN_KEY;
  referencedConstraintName: string;
  referencedTableName: string;
  references: ForeignKeyColumnReference[];
}

export interface UniqueTableConstraint extends BaseTableConstraint {
  type: TableConstraintType.UNIQUE;
}

export interface CheckTableConstraint extends BaseTableConstraint {
  type: TableConstraintType.CHECK;
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
