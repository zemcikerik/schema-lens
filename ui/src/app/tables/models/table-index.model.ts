export interface TableIndex {
  name: string;
  type: TableIndexType;
  unique: boolean;
  compressed: boolean;
  logged: boolean;
  columns: TableIndexColumn[];
}

export enum TableIndexType {
  NORMAL = 'NORMAL',
  NORMAL_REVERSE = 'NORMAL_REVERSE',
  BITMAP = 'BITMAP',
  FUNCTION_NORMAL = 'FUNCTION_NORMAL',
  FUNCTION_NORMAL_REVERSE = 'FUNCTION_NORMAL_REVERSE',
  FUNCTION_BITMAP = 'FUNCTION_BITMAP',
}

export enum TableIndexColumnDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export interface TableIndexColumn {
  position: number;
  name: string;
  expression: string | null;
  direction: TableIndexColumnDirection;
}
