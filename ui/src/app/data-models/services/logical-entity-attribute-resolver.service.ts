import { computed, inject, Injectable, Signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { LogicalModelStore } from '../logical-model.store';
import { DirectResolvedAttribute, RelationshipResolvedAttribute, ResolvedAttribute } from '../models/resolved-attribute.model';

@Injectable()
export class LogicalEntityAttributeResolverService {
  private readonly store = inject(LogicalModelStore);

  resolveAttributes(entityId: number): Signal<ResolvedAttribute[]> {
    return computed(() => {
      const entities = this.store.entities();
      const relationships = this.store.relationships();

      const entity = entities.find(e => e.entityId === entityId);

      const direct: DirectResolvedAttribute[] = (entity?.attributes ?? []).map(attr => ({
        source: 'direct' as const,
        attribute: attr,
        position: attr.position,
      }));

      const fromRelationships: RelationshipResolvedAttribute[] = relationships
        .filter(r => r.toEntityId === entityId)
        .flatMap(r =>
          r.attributes.map(attr => ({
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

        const idA = a.source === 'direct' ? (a.attribute.attributeId ?? 0) : a.attribute.referencedAttributeId;
        const idB = b.source === 'direct' ? (b.attribute.attributeId ?? 0) : b.attribute.referencedAttributeId;
        return idA - idB;
      });
    });
  }

  // TODO: replace with efficient implementation via single endpoint
  reorderAttributes(entityId: number, orderedAttributes: ResolvedAttribute[]): Observable<unknown> {
    const directUpdates: Observable<unknown>[] = [];
    const relationshipUpdates = new Map<number, RelationshipResolvedAttribute[]>();

    orderedAttributes.forEach((resolved, index) => {
      const newPosition = index;

      if (resolved.source === 'direct') {
        if (resolved.attribute.position !== newPosition) {
          directUpdates.push(
            this.store.updateAttribute(entityId, { ...resolved.attribute, position: newPosition }),
          );
        }
      } else {
        const relationshipId = resolved.relationship.relationshipId as number;
        if (!relationshipUpdates.has(relationshipId)) {
          relationshipUpdates.set(relationshipId, []);
        }
        relationshipUpdates.get(relationshipId)?.push({ ...resolved, position: newPosition });
      }
    });

    const relationshipObservables: Observable<unknown>[] = [];

    for (const [relationshipId, updatedResolved] of relationshipUpdates) {
      const relationship = this.store.relationships().find(r => r.relationshipId === relationshipId);

      if (!relationship) {
        continue;
      }

      const updatedRelationship = {
        ...relationship,
        attributes: relationship.attributes.map(attr => {
          const match = updatedResolved.find(r => r.attribute.referencedAttributeId === attr.referencedAttributeId);
          return match ? { ...attr, position: match.position } : attr;
        }),
      };

      const hasChanges = updatedRelationship.attributes.some(
        (attr, i) => attr.position !== relationship.attributes[i].position,
      );

      if (hasChanges) {
        relationshipObservables.push(this.store.updateRelationship(updatedRelationship));
      }
    }

    return forkJoin([...directUpdates, ...relationshipObservables]);
  }
}
