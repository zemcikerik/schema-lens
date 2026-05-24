export type DbSystem = 'oracle';

export interface DataModelDataType {
  typeId: number | null;
  name: string;

  parameters?: DataModelDataTypeParameter[];
  mappings?: DataModelDataTypeMapping[];
}

export interface DataModelDataTypeParameter {
  name: string;
}

export interface DataModelDataTypeMapping {
  dbSystem: DbSystem;
  physicalDataType?: string;
  checkConstraint?: string;
}