import { DataModelDiagram } from './data-model-diagram.model';

export interface DataModelDetails {
  dataTypes: DataModelDataType[];
  nodes: DataModelNode[];
  edges: DataModelEdge[];
  diagrams: DataModelDiagram[];
}

export interface DataModelDataType {
  typeId: number | null;
  name: string;
}

export interface DataModelNodeSummary {
  nodeId: number | null;
  name: string;
}

export interface DataModelNode extends DataModelNodeSummary {
  fields: DataModelField[];
}

export interface DataModelField {
  fieldId: number | null;
  name: string;
  typeId: number;
  isPrimaryKey: boolean;
  isNullable: boolean;
  position: number;
}

export interface DataModelEdge {
  edgeId: number | null;
  modelId: number;
  fromNodeId: number;
  toNodeId: number;
  type: DataModelEdgeType;
  isMandatory: boolean;
  isIdentifying: boolean;
  fields: DataModelEdgeField[];
}

export type DataModelEdgeType = '1:1' | '1:N';

export interface DataModelEdgeField {
  referencedFieldId: number;
  name: string;
  position: number;
}

export interface DataModelModification {
  updatedNodes: DataModelNode[];
  updatedEdges: DataModelEdge[];
}

export interface DataModelFieldReorderRequest {
  directFields: { fieldId: number; position: number }[];
  edgeFields: { edgeId: number; referencedFieldId: number; position: number }[];
}
