import { DataModelingContext } from "../data-model-context.state";

export type DataModelDiagramType = 'logical' | 'oracle';

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

export interface OraclePhysicalModelDiagram extends BaseDataModelDiagram {
  type: 'oracle';
}

export type DataModelDiagram = LogicalModelDiagram | OraclePhysicalModelDiagram;

export function mapContextToDataModelDiagramType(context: DataModelingContext): DataModelDiagramType {
  return context === 'oracle' ? 'oracle' : 'logical';
}

export function mapDataModelDiagramTypeToContext(diagramType: DataModelDiagramType): DataModelingContext {
  return diagramType === 'oracle' ? 'oracle' : 'logical';
}

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
