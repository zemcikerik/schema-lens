export type DataModelDiagramType = 'logical';

export interface BaseDataModelDiagram {
  id: number | null;
  name: string;
  type: DataModelDiagramType;
  nodes?: DataModelDiagramNodePosition[];
  edges?: DataModelDiagramEdgePosition[];
}

export interface LogicalModelDiagram extends BaseDataModelDiagram {
  type: 'logical';
}

export type DataModelDiagram = LogicalModelDiagram;

export interface DataModelDiagramNodePosition {
  nodeId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DataModelDiagramEdgePosition {
  edgeId: number;
  points: {
    x: number;
    y: number;
  }[];
}
