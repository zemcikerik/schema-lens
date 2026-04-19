import { Injectable } from '@angular/core';
import { DataModelEdge } from '../models/data-model-edge.model';

export interface CascadeDeletion {
  deletedNodeIds: number[];
  deletedEdgeIds: number[];
}

@Injectable({ providedIn: 'root' })
export class DataModelCascadeDeletionService {

  resolveNodeDeletion(nodeId: number, edges: DataModelEdge[]): CascadeDeletion {
    const deletedEdgeIds = edges
      .filter(e => e.fromNodeId === nodeId || e.toNodeId === nodeId)
      .map(e => e.edgeId as number);

    return { deletedNodeIds: [nodeId], deletedEdgeIds };
  }

  resolveEdgeDeletion(edgeId: number): CascadeDeletion {
    return { deletedNodeIds: [], deletedEdgeIds: [edgeId] };
  }
}
