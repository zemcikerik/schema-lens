import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { LogicalAttribute, LogicalRelationship } from '../models/logical-model.model';
import { LogicalModelStore } from '../logical-model.store';
import { AttributeUpdateResult } from '../models/attribute-update-result.model';
import { LogicalRelationshipCascadeService } from './logical-relationship-cascade.service';

@Injectable()
export class LogicalAttributeEditorService {
  private readonly store = inject(LogicalModelStore);
  private readonly cascade = inject(LogicalRelationshipCascadeService);

  // TODO: move the cascade logic to the backend and replace with single endpoint
  createAttribute(entityId: number, attribute: LogicalAttribute): Observable<AttributeUpdateResult> {
    return this.store.createAttribute(entityId, attribute).pipe(
      switchMap(savedAttribute => {
        if (!savedAttribute.isPrimaryKey) {
          return of({ updatedAttribute: savedAttribute, affectedRelationships: [] });
        }

        return this.cascadePrimaryKeyChange(entityId, savedAttribute);
      }),
    );
  }

  editAttribute(entityId: number, previous: LogicalAttribute, updated: LogicalAttribute): Observable<AttributeUpdateResult> {
    return this.store.updateAttribute(entityId, updated).pipe(
      switchMap(savedAttribute => {
        const pkChanged = previous.isPrimaryKey !== savedAttribute.isPrimaryKey;

        if (!pkChanged) {
          return of({ updatedAttribute: savedAttribute, affectedRelationships: [] });
        }

        return this.cascadePrimaryKeyChange(entityId, savedAttribute);
      }),
    );
  }

  private cascadePrimaryKeyChange(entityId: number, attribute: LogicalAttribute): Observable<AttributeUpdateResult> {
    const allRelationships = this.store.relationships();

    const impactedRelationships = attribute.isPrimaryKey
      ? [
          ...this.cascade.relationshipsInIdentifyingChain(entityId, allRelationships),
          ...allRelationships.filter(r => r.fromEntityId === entityId && !r.isIdentifying),
        ]
      : allRelationships.filter(r => r.attributes.some(a => a.referencedAttributeId === attribute.attributeId));

    if (impactedRelationships.length === 0) {
      return of({ updatedAttribute: attribute, affectedRelationships: [] });
    }

    const relationshipUpdates$: Observable<LogicalRelationship>[] = impactedRelationships.map(rel =>
      this.store.updateRelationship(this.cascade.applyPrimaryKeyChange(rel, attribute)),
    );

    return forkJoin(relationshipUpdates$).pipe(
      map(affectedRelationships => ({ updatedAttribute: attribute, affectedRelationships })),
    );
  }
}
