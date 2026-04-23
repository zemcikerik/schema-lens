import { DataModelNode } from './data-model-node.model';
import { DataModelEdge } from './data-model-edge.model';
import { DataModelDiagram } from './data-model-diagram.model';
import { DataModelDataType } from './data-model-data-type.model';

export interface DataModel {
  id: number | null;
  name: string;
  enabledContexts: DataModelEnabledContexts;
}

export interface DataModelEnabledContexts {
  oracleEnabled: boolean;
}

export interface DataModelDetails {
  enabledContexts: DataModelEnabledContexts;
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
  visuallyStaleNodeIds: number[];
}

export function mergeDataModelModification(...modifications: DataModelModification[]): DataModelModification {
  const nodeMap = new Map<number, DataModelNode>();
  const edgeMap = new Map<number, DataModelEdge>();
  const deletedNodeIds = new Set<number>();
  const deletedEdgeIds = new Set<number>();
  const visuallyStaleNodeIds = new Set<number>();

  for (const mod of modifications) {
    for (const node of mod.updatedNodes) {
      nodeMap.set(node.nodeId as number, node);
    }
    for (const edge of mod.updatedEdges) {
      edgeMap.set(edge.edgeId as number, edge);
    }
    for (const id of mod.deletedNodeIds) {
      deletedNodeIds.add(id);
    }
    for (const id of mod.deletedEdgeIds) {
      deletedEdgeIds.add(id);
    }
    for (const id of mod.visuallyStaleNodeIds) {
      visuallyStaleNodeIds.add(id);
    }
  }

  for (const notStaleNodeId of nodeMap.keys()) {
    visuallyStaleNodeIds.delete(notStaleNodeId);
  }

  return {
    updatedNodes: [...nodeMap.values()],
    updatedEdges: [...edgeMap.values()],
    deletedNodeIds: [...deletedNodeIds],
    deletedEdgeIds: [...deletedEdgeIds],
    visuallyStaleNodeIds: [...visuallyStaleNodeIds],
  };
}
