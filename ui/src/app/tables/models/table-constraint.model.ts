export type TableConstraintType = 'primary-key' | 'foreign-key' | 'unique' | 'check';

interface BaseTableConstraint {
  name: string;
  type: TableConstraintType;
  columnNames: string[];
}

export interface PrimaryKeyTableConstraint extends BaseTableConstraint {
  type: 'primary-key';
}

export type TableConstraint = PrimaryKeyTableConstraint;
