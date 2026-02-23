import { LogicalAttribute, LogicalRelationship } from './logical-model.model';

export interface AttributeUpdateResult {
  updatedAttribute: LogicalAttribute;
  affectedRelationships: LogicalRelationship[];
}
