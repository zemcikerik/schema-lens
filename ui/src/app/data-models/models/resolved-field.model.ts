import { DataModelEdge, DataModelEdgeField } from './data-model-edge.model';
import { DataModelField } from './data-model-node.model';

export interface DirectResolvedField {
  source: 'direct';
  field: DataModelField;
  position: number;
}

export interface EdgeResolvedField {
  source: 'edge';
  field: DataModelEdgeField;
  referencedField: DataModelField;
  edge: DataModelEdge;
  position: number;
}

export type ResolvedField = DirectResolvedField | EdgeResolvedField;
