import { Injectable } from '@angular/core';
import { LogicalAttribute, LogicalDataType, LogicalEntity, LogicalRelationship } from '../../models/logical-model.model';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import { SchemaDiagramEdge, EDGE_TYPE_ONE_TO_MANY, EDGE_TYPE_ONE_TO_ONE } from '../../../diagrams/schema/model/schema-diagram-edge.model';
import { SchemaDiagramField } from '../../../diagrams/schema/model/schema-diagram-field.model';

@Injectable()
export class LogicalDiagramMapper {

  entityToNode(entity: LogicalEntity, dataTypes: LogicalDataType[], relationships: LogicalRelationship[] = []): SchemaDiagramNode {
    const parentEdges = relationships
      .filter(rel => rel.toEntityId === entity.entityId)
      .map(rel => this.relationshipToEdge(rel));

    return {
      id: entity.entityId as number,
      name: entity.name,
      fields: entity.attributes.map(a => this.attributeToField(a, dataTypes)),
      parentEdges,
      uniqueFieldGroups: [],
    };
  }

  relationshipToEdge(rel: LogicalRelationship): SchemaDiagramEdge {
    return {
      id: rel.relationshipId as number,
      fromNode: rel.fromEntityId,
      toNode: rel.toEntityId,
      type: rel.type === '1:1' ? EDGE_TYPE_ONE_TO_ONE : EDGE_TYPE_ONE_TO_MANY,
      mandatory: rel.isMandatory,
      identifying: rel.isIdentifying,
      references: rel.attributes.map(a => ({
        fromFieldName: a.name,
        toFieldName: a.name,
      })),
    };
  }

  private attributeToField(attr: LogicalAttribute, dataTypes: LogicalDataType[]): SchemaDiagramField {
    return {
      name: attr.name,
      type: dataTypes.find(t => t.typeId === attr.typeId)?.name ?? String(attr.typeId),
      key: attr.isPrimaryKey,
      nullable: attr.isNullable,
    };
  }
}
