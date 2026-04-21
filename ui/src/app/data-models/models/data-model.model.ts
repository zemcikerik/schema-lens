import { DataModelNode } from './data-model-node.model';
import { DataModelEdge } from './data-model-edge.model';
import { DataModelDiagram } from './data-model-diagram.model';
import { DataModelDataType } from './data-model-data-type.model';

export interface DataModel {
  id: number | null;
  name: string;
}

export interface DataModelDetails {
  dataTypes: DataModelDataType[];
  nodes: DataModelNode[];
  edges: DataModelEdge[];
  diagrams: DataModelDiagram[];
}

export interface DataModelModification {
  updatedNodes: DataModelNode[];
  updatedEdges: DataModelEdge[];
  deletedNodeIds: number[];
  deletedEdgeIds: number[];
}
