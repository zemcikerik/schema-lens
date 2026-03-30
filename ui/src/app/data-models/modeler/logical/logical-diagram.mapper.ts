import { Injectable } from '@angular/core';
import { DataModelDataType, DataModelEdge, DataModelField, DataModelNode } from '../../models/data-model-types.model';
import { SchemaDiagramNode } from '../../../diagrams/schema/model/schema-diagram-node.model';
import { SchemaDiagramEdge, EDGE_TYPE_ONE_TO_MANY, EDGE_TYPE_ONE_TO_ONE } from '../../../diagrams/schema/model/schema-diagram-edge.model';
import { SchemaDiagramField } from '../../../diagrams/schema/model/schema-diagram-field.model';

@Injectable()
export class LogicalDiagramMapper {

  entityToNode(entity: DataModelNode, dataTypes: DataModelDataType[], relationships: DataModelEdge[] = []): SchemaDiagramNode {
    const parentEdges = relationships
      .filter(rel => rel.toNodeId === entity.nodeId)
      .map(rel => this.relationshipToEdge(rel));

    return {
      id: entity.nodeId as number,
      name: entity.name,
      fields: entity.fields.map(a => this.attributeToField(a, dataTypes)),
      parentEdges,
      uniqueFieldGroups: [],
    };
  }

  relationshipToEdge(rel: DataModelEdge): SchemaDiagramEdge {
    return {
      id: rel.edgeId as number,
      fromNode: rel.fromNodeId,
      toNode: rel.toNodeId,
      type: rel.type === '1:1' ? EDGE_TYPE_ONE_TO_ONE : EDGE_TYPE_ONE_TO_MANY,
      mandatory: rel.isMandatory,
      identifying: rel.isIdentifying,
      references: rel.fields.map(a => ({
        fromFieldName: a.name,
        toFieldName: a.name,
      })),
    };
  }

  private attributeToField(attr: DataModelField, dataTypes: DataModelDataType[]): SchemaDiagramField {
    return {
      name: attr.name,
      type: dataTypes.find(t => t.typeId === attr.typeId)?.name ?? String(attr.typeId),
      key: attr.isPrimaryKey,
      nullable: attr.isNullable,
    };
  }
}
