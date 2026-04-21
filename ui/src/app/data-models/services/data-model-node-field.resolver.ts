import { computed, inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelStore } from '../data-model.store';
import { DirectResolvedField, EdgeResolvedField, ResolvedField } from '../models/resolved-field.model';
import { DataModelField, DataModelFieldReorderRequest, DataModelNode } from '../models/data-model-node.model';
import { DataModelModification } from '../models/data-model.model';

@Injectable({ providedIn: 'root' })
export class DataModelNodeFieldResolver {
  private readonly store = inject(DataModelStore);

  resolveFields(nodeId: number): Signal<ResolvedField[]> {
    return computed(() => {
      const nodes = this.store.nodes();
      const edges = this.store.edges();

      const node = nodes.find(n => n.nodeId === nodeId);

      const direct: DirectResolvedField[] = (node?.fields ?? []).map(field => ({
        source: 'direct' as const,
        field: field,
        position: field.position,
      }));

      const fromEdges: EdgeResolvedField[] = edges
        .filter(e => e.toNodeId === nodeId)
        .flatMap(e => {
          const sourceNode = nodes.find(n => n.nodeId === e.fromNodeId) as DataModelNode;

          return e.fields.map(field => ({
            source: 'edge' as const,
            field: field,
            edge: e,
            referencedField: sourceNode.fields.find(f => f.fieldId === field.referencedFieldId) as DataModelField,
            position: field.position,
          }));
        });

      return [...direct, ...fromEdges].sort((a, b) => {
        if (a.position !== b.position) {
          return a.position - b.position;
        }
        if (a.source !== b.source) {
          return a.source === 'direct' ? -1 : 1;
        }

        const idA = a.source === 'direct' ? (a.field.fieldId ?? 0) : a.field.referencedFieldId;
        const idB = b.source === 'direct' ? (b.field.fieldId ?? 0) : b.field.referencedFieldId;
        return idA - idB;
      });
    });
  }

  reorderFields(nodeId: number, orderedFields: ResolvedField[]): Observable<DataModelModification> {
    const request: DataModelFieldReorderRequest = {
      directFields: [],
      edgeFields: [],
    };

    orderedFields.forEach((resolved, index) => {
      if (resolved.source === 'direct') {
        request.directFields.push({
          fieldId: resolved.field.fieldId as number,
          position: index,
        });
      } else {
        request.edgeFields.push({
          edgeId: resolved.edge.edgeId as number,
          referencedFieldId: resolved.field.referencedFieldId,
          position: index,
        });
      }
    });

    return this.store.reorderFields(nodeId, request);
  }
}
