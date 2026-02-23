import { LogicalRelationship } from './logical-model.model';

export interface AttributeDeletionResult {
  affectedRelationships: LogicalRelationship[];
}
