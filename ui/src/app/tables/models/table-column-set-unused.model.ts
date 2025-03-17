export interface TableColumnSetUnusedStatus {
  available: boolean;
  cascadeConstraintsRequired: boolean;
  referencedByTables: string[];
  usedInMultiColumnConstraints: string[];
}

export interface TableColumnSetUnusedOptions {
  tableName: string;
  columnName: string;
  cascadeConstraints: boolean;
}
