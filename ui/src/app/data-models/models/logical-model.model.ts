import { DataModelDiagram } from './data-model-diagram.model';

export interface LogicalDataModel {
  dataTypes: LogicalDataType[];
  entities: LogicalEntity[];
  relationships: LogicalRelationship[];
  diagrams: DataModelDiagram[];
}

export interface LogicalDataType {
  typeId: number | null;
  name: string;
}

export interface LogicalEntitySummary {
  entityId: number | null;
  name: string;
}

export interface LogicalEntity extends LogicalEntitySummary {
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
  relationshipId: number | null;
  fromEntityId: number;
  toEntityId: number;
  type: LogicalRelationshipType;
  isMandatory: boolean;
  isIdentifying: boolean;
  attributes: LogicalRelationshipAttribute[];
}

export type LogicalRelationshipType = '1:1' | '1:N';

export interface LogicalRelationshipAttribute {
  referencedAttributeId: number;
  name: string;
  position: number;
}
