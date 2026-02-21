import { Diagram } from './diagram';

export interface LogicalDataModel {
  dataTypes: DataType[];
  entities: LogicalEntity[];
  relationships: LogicalRelationship[];
  diagrams: Diagram[];
}

// TODO: inconsistent naming
export interface DataType {
  typeId: number | null;
  name: string;
}

export interface LogicalEntity {
  entityId: number | null;
  name: string;
  attributes: LogicalAttribute[];
}

export interface LogicalAttribute {
  attributeId: number | null;
  name: string;
  typeId: number;
  isPrimaryKey: boolean;
  isNullable: boolean;
  position: number;
}

export interface LogicalRelationship {
  relationshipId: number;
  fromEntityId: number;
  toEntityId: number;
  type: string;
  isMandatory: boolean;
  isIdentifying: boolean;
  attributes: LogicalRelationshipAttribute[];
}

export interface LogicalRelationshipAttribute {
  referencedAttributeId: number;
  name: string;
  position: number;
}
