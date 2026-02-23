import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { LogicalRelationship } from '../models/logical-model.model';
import { LogicalModelStore } from '../logical-model.store';
import { RelationshipUpdateResult } from '../models/relationship-update-result.model';
import { LogicalRelationshipCascadeService } from './logical-relationship-cascade.service';

@Injectable()
export class LogicalRelationshipEditorService {
  private store = inject(LogicalModelStore);
  private cascade = inject(LogicalRelationshipCascadeService);

  // TODO: move the cascade logic to the backend and replace with single endpoint
  updateRelationship(previous: LogicalRelationship, updated: LogicalRelationship): Observable<RelationshipUpdateResult> {
    return this.store.updateRelationship(updated).pipe(
      switchMap(savedRelationship => {
        const identifyingChanged = previous.isIdentifying !== savedRelationship.isIdentifying;

        if (!identifyingChanged) {
          return of({ updatedRelationship: savedRelationship, affectedEntityIds: [updated.toEntityId] });
        }

        return this.cascadeIdentifyingChange(savedRelationship);
      }),
    );
  }

  private cascadeIdentifyingChange(relationship: LogicalRelationship): Observable<RelationshipUpdateResult> {
    const allRelationships = this.store.relationships();

    const downstreamRelationships = this.cascade
      .relationshipsInIdentifyingChain(relationship.toEntityId, allRelationships)
      .filter(r => r.relationshipId !== relationship.relationshipId);

    if (downstreamRelationships.length === 0) {
      return of({ updatedRelationship: relationship, affectedEntityIds: [relationship.toEntityId] });
    }

    let cascadedRelationships = downstreamRelationships;
    for (const attr of relationship.attributes) {
      const pseudoAttribute = {
        attributeId: attr.referencedAttributeId,
        name: attr.name,
        isPrimaryKey: relationship.isIdentifying,
        typeId: 0,
        isNullable: false,
        position: 0,
      };

      cascadedRelationships = cascadedRelationships.map(r =>
        this.cascade.applyPrimaryKeyChange(r, pseudoAttribute),
      );
    }

    const relationshipUpdates$: Observable<LogicalRelationship>[] = cascadedRelationships.map(r =>
      this.store.updateRelationship(r),
    );

    const affectedEntityIds = [...new Set([relationship.toEntityId, ...downstreamRelationships.map(r => r.toEntityId)])];

    return forkJoin(relationshipUpdates$).pipe(
      map(() => ({ updatedRelationship: relationship, affectedEntityIds })),
    );
  }
}
