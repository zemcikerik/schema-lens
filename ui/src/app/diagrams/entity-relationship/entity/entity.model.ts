export interface Entity {
  name: string;
  columns: EntityColumn[];
}

export interface EntityColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}
