import { Connection } from 'diagram-js/lib/model/Types';
import { EntityShape } from '../entity/entity.shape';
import { Relationship } from './relationship.model';

export interface RelationshipConnection extends Connection {
  id: `relationship_${string}`;
  source: EntityShape;
  target: EntityShape;
  relationship: Relationship;
}

export const isRelationshipConnection = (connection: Connection): connection is RelationshipConnection => {
  return connection.id.startsWith('relationship_');
};
