import { computed, inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelStore } from '../data-model.store';
import { DirectResolvedAttribute, RelationshipResolvedAttribute, ResolvedAttribute } from '../models/resolved-attribute.model';
import { DataModelFieldReorderRequest } from '../models/data-model-types.model';

@Injectable()
export class LogicalEntityAttributeResolverService {
  private readonly store = inject(DataModelStore);

  resolveAttributes(entityId: number): Signal<ResolvedAttribute[]> {
    return computed(() => {
      const nodes = this.store.nodes();
      const edges = this.store.edges();

      const entity = nodes.find(e => e.nodeId === entityId);

      const direct: DirectResolvedAttribute[] = (entity?.fields ?? []).map(attr => ({
        source: 'direct' as const,
        attribute: attr,
        position: attr.position,
      }));

      const fromRelationships: RelationshipResolvedAttribute[] = edges
        .filter(r => r.toNodeId === entityId)
        .flatMap(r =>
          r.fields.map(attr => ({
            source: 'relationship' as const,
            attribute: attr,
            relationship: r,
            position: attr.position,
          })),
        );

      return [...direct, ...fromRelationships].sort((a, b) => {
        if (a.position !== b.position) {
          return a.position - b.position;
        }
        if (a.source !== b.source) {
          return a.source === 'direct' ? -1 : 1;
        }

        const idA = a.source === 'direct' ? (a.attribute.fieldId ?? 0) : a.attribute.referencedFieldId;
        const idB = b.source === 'direct' ? (b.attribute.fieldId ?? 0) : b.attribute.referencedFieldId;
        return idA - idB;
      });
    });
  }

  reorderAttributes(entityId: number, orderedAttributes: ResolvedAttribute[]): Observable<unknown> {
    const request: DataModelFieldReorderRequest = {
      directFields: [],
      edgeFields: [],
    };

    orderedAttributes.forEach((resolved, index) => {
      if (resolved.source === 'direct') {
        request.directFields.push({
          fieldId: resolved.attribute.fieldId as number,
          position: index,
        });
      } else {
        request.edgeFields.push({
          edgeId: resolved.relationship.edgeId as number,
          referencedFieldId: resolved.attribute.referencedFieldId,
          position: index,
        });
      }
    });

    return this.store.reorderFields(entityId, request);
  }
}
