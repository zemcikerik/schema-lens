import { LogicalAttribute, LogicalRelationship, LogicalRelationshipAttribute } from './logical-model.model';

export type ResolvedAttributeSource = 'direct' | 'relationship';

export interface DirectResolvedAttribute {
  source: 'direct';
  attribute: LogicalAttribute;
  position: number;
}

export interface RelationshipResolvedAttribute {
  source: 'relationship';
  attribute: LogicalRelationshipAttribute;
  relationship: LogicalRelationship;
  position: number;
}

export type ResolvedAttribute = DirectResolvedAttribute | RelationshipResolvedAttribute;
