import { Injectable } from '@angular/core';
import { DataModelEdge } from '../models/data-model-edge.model';

@Injectable({ providedIn: 'root' })
export class DataModelEdgeCycleService {

  wouldIdentifyingCycle(edges: DataModelEdge[], fromNodeId: number, toNodeId: number, excludeEdgeId: number | null): boolean {
    if (fromNodeId === toNodeId) {
      return true;
    }

    const outgoing = new Map<number, number[]>();

    for (const edge of edges) {
      if (!edge.isIdentifying || edge.edgeId === excludeEdgeId) {
        continue;
      }

      const list = outgoing.get(edge.fromNodeId);

      if (list) {
        list.push(edge.toNodeId);
      } else {
        outgoing.set(edge.fromNodeId, [edge.toNodeId]);
      }
    }

    const visited = new Set<number>();
    const queue: number[] = [toNodeId];

    while (queue.length > 0) {
      const current = queue.pop() as number;

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);
      if (current === fromNodeId) {
        return true;
      }

      queue.push(...(outgoing.get(current) ?? []));
    }

    return false;
  }
}
