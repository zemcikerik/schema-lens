import { LogicalRelationship } from './logical-model.model';

export interface RelationshipUpdateResult {
  updatedRelationship: LogicalRelationship;
  affectedEntityIds: number[];
}
