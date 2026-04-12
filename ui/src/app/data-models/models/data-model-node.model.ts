export interface DataModelNodeSummary {
  nodeId: number | null;
  name: string;
}

export interface DataModelNode extends DataModelNodeSummary {
  fields: DataModelField[];
}

export interface DataModelField {
  fieldId: number | null;
  name: string;
  typeId: number;
  isPrimaryKey: boolean;
  isNullable: boolean;
  position: number;
}

export interface DataModelFieldReorderRequest {
  directFields: { fieldId: number; position: number }[];
  edgeFields: { edgeId: number; referencedFieldId: number; position: number }[];
}
