export type DataModelDiagramType = 'logical';

export interface BaseDataModelDiagram {
  id: number | null;
  name: string;
  type: DataModelDiagramType;
}

export interface LogicalModelDiagram extends BaseDataModelDiagram {
  type: 'logical';
  nodes?: LogicalEntityPosition[];
  edges?: LogicalRelationshipPosition[];
}

export type DataModelDiagram = LogicalModelDiagram;

export interface LogicalEntityPosition {
  nodeId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LogicalRelationshipPosition {
  edgeId: number;
  points: {
    x: number;
    y: number;
  }[];
}
