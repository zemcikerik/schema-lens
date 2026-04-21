import { inject, Injectable } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelEdge } from '../models/data-model-edge.model';
import { DataModelField, DataModelNode } from '../models/data-model-node.model';
import { SchemaDiagramNode } from '../../diagrams/schema/model/schema-diagram-node.model';
import { EDGE_TYPE_ONE_TO_MANY, EDGE_TYPE_ONE_TO_ONE, SchemaDiagramEdge } from '../../diagrams/schema/model/schema-diagram-edge.model';
import { SchemaDiagramField } from '../../diagrams/schema/model/schema-diagram-field.model';
import { DataModelDataTypeResolver } from '../services/data-model-data-type.resolver';

@Injectable()
export class DataModelerDiagramMapper {
  private typeResolver = inject(DataModelDataTypeResolver);

  nodeToDiagramNode(node: DataModelNode, dataTypes: DataModelDataType[], parentEdges: DataModelEdge[] = []): SchemaDiagramNode {
    return {
      id: node.nodeId as number,
      name: node.name,
      fields: node.fields.map(f => this.fieldToDiagramField(f, dataTypes)),
      parentEdges: parentEdges
        .filter(e => e.toNodeId === node.nodeId)
        .map(e => this.edgeToDiagramEdge(e)),
      uniqueFieldGroups: [],
    };
  }

  edgeToDiagramEdge(edge: DataModelEdge): SchemaDiagramEdge {
    return {
      id: edge.edgeId as number,
      fromNode: edge.fromNodeId,
      toNode: edge.toNodeId,
      type: edge.type === '1:1' ? EDGE_TYPE_ONE_TO_ONE : EDGE_TYPE_ONE_TO_MANY,
      mandatory: edge.isMandatory,
      identifying: edge.isIdentifying,
      references: edge.fields.map(a => ({
        fromFieldName: a.name,
        toFieldName: a.name,
      })),
    };
  }

  private fieldToDiagramField(attr: DataModelField, dataTypes: DataModelDataType[]): SchemaDiagramField {
    return {
      name: attr.name,
      type: this.typeResolver.resolveFrom(attr.typeId, dataTypes),
      key: attr.isPrimaryKey,
      nullable: attr.isNullable,
    };
  }
}
