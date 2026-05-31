import { Injectable } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelDetails } from '../models/data-model.model';
import { DataModelField, DataModelFieldDataTypeParameter, DataModelNode } from '../models/data-model-node.model';

@Injectable({ providedIn: 'root' })
export class DataModelDataTypeSyncService {

  applyDataTypeUpdate(model: DataModelDetails, updated: DataModelDataType): DataModelDetails {
    return {
      ...model,
      dataTypes: this.replaceDataType(model.dataTypes, updated),
      nodes: model.nodes.map(node => this.syncNodeFields(node, updated)),
    };
  }

  private replaceDataType(dataTypes: DataModelDataType[], updated: DataModelDataType): DataModelDataType[] {
    return dataTypes.map(type => (type.typeId === updated.typeId ? updated : type));
  }

  private syncNodeFields(node: DataModelNode, dataType: DataModelDataType): DataModelNode {
    return {
      ...node,
      fields: node.fields.map(field => this.syncFieldType(field, dataType)),
    };
  }

  private syncFieldType(field: DataModelField, dataType: DataModelDataType): DataModelField {
    if (field.typeId !== dataType.typeId) {
      return field;
    }

    return {
      ...field,
      typeParameters: this.syncFieldTypeParameters(field.typeParameters, dataType),
    };
  }

  private syncFieldTypeParameters(
    existing: DataModelFieldDataTypeParameter[],
    dataType: DataModelDataType,
  ): DataModelFieldDataTypeParameter[] {
    const valuesByName = new Map(existing.map(parameter => [parameter.name, parameter.value]));

    return dataType.parameters.map(parameter => ({
      name: parameter.name,
      value: valuesByName.get(parameter.name) ?? null,
    }));
  }
}
