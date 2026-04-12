import { DataModelEdge, DataModelEdgeField, DataModelField } from './data-model-types.model';

export interface DirectResolvedField {
  source: 'direct';
  field: DataModelField;
  position: number;
}

export interface EdgeResolvedField {
  source: 'edge';
  field: DataModelEdgeField;
  edge: DataModelEdge;
  position: number;
}

export type ResolvedField = DirectResolvedField | EdgeResolvedField;
