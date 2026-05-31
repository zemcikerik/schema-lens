import type { DataModelingDbSystem } from '../data-model-context.state';

export interface DataModelDataType {
  typeId: number | null;
  name: string;
  parameters: DataModelDataTypeParameter[];
  mappings: DataModelDataTypeMapping[];
}

export interface DataModelDataTypeParameter {
  name: string;
}

export interface DataModelDataTypeMapping {
  dbSystem: DataModelingDbSystem;
  physicalDataType: string;
  checkConstraint: string | null;
}
