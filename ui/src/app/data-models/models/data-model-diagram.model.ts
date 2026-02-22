export type DataModelDiagramType = 'logical';

export interface BaseDataModelDiagram {
  id: number | null;
  name: string;
  type: DataModelDiagramType;
}

export interface LogicalModelDiagram extends BaseDataModelDiagram {
  type: 'logical';
  entities: LogicalEntityPosition[];
  relationships: LogicalRelationshipPosition[];
}

export type DataModelDiagram = LogicalModelDiagram;

export interface LogicalEntityPosition {
  entityId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LogicalRelationshipPosition {
  relationshipId: number;
  points: {
    x: number;
    y: number;
  }[];
}
