import { Injectable } from '@angular/core';
import { LogicalAttribute, LogicalRelationship } from '../models/logical-model.model';

@Injectable()
export class LogicalRelationshipCascadeService {

  relationshipsInIdentifyingChain(
    entityId: number,
    allRelationships: LogicalRelationship[],
  ): LogicalRelationship[] {
    const result: LogicalRelationship[] = [];
    const visited = new Set<number>();
    const queue: number[] = [entityId];

    while (queue.length > 0) {
      const currentEntityId = queue.shift() as number;
      if (visited.has(currentEntityId)) {
        continue;
      }
      visited.add(currentEntityId);

      for (const rel of allRelationships) {
        if (rel.fromEntityId === currentEntityId && rel.isIdentifying) {
          result.push(rel);
          queue.push(rel.toEntityId);
        }
      }
    }

    return result;
  }

  applyPrimaryKeyChange(relationship: LogicalRelationship, attribute: LogicalAttribute): LogicalRelationship {
    if (!attribute.isPrimaryKey) {
      return {
        ...relationship,
        attributes: relationship.attributes.filter(a => a.referencedAttributeId !== attribute.attributeId),
      };
    }

    const alreadyReferenced = relationship.attributes.some(a => a.referencedAttributeId === attribute.attributeId);

    // TODO: can this happen?
    if (alreadyReferenced) {
      return relationship;
    }

    const nextPosition = relationship.attributes.length
      ? Math.max(...relationship.attributes.map(a => a.position)) + 1
      : 0;

    return {
      ...relationship,
      attributes: [
        ...relationship.attributes,
        {
          referencedAttributeId: attribute.attributeId as number,
          name: attribute.name,
          position: nextPosition,
        },
      ],
    };
  }
}
