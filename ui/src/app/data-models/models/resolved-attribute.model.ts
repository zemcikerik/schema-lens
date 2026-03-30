import { DataModelEdge, DataModelEdgeField, DataModelField } from './data-model-types.model';

export type ResolvedAttributeSource = 'direct' | 'relationship';

export interface DirectResolvedAttribute {
  source: 'direct';
  attribute: DataModelField;
  position: number;
}

export interface RelationshipResolvedAttribute {
  source: 'relationship';
  attribute: DataModelEdgeField;
  relationship: DataModelEdge;
  position: number;
}

export type ResolvedAttribute = DirectResolvedAttribute | RelationshipResolvedAttribute;
