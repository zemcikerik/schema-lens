import { Injectable } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelingContext, mapDataModelingContextToDbSystem } from '../data-model-context.state';
import { DataModelFieldDataTypeParameter } from '../models/data-model-node.model';

@Injectable({ providedIn: 'root' })
export class DataModelDataTypeResolver {

  resolveFromContext(
    typeId: number,
    types: DataModelDataType[],
    context: DataModelingContext,
    parameters: DataModelFieldDataTypeParameter[],
  ): string {
    const type = types.find(entry => entry.typeId === typeId);

    if (!type) {
      return String(typeId);
    }

    const dbSystem = mapDataModelingContextToDbSystem(context);
    const template = dbSystem
      ? (type.mappings.find(mapping => mapping.dbSystem === dbSystem)?.physicalDataType ?? '-')
      : type.name;

    return this.applyParameters(template, parameters);
  }

  private applyParameters(template: string, parameters: DataModelFieldDataTypeParameter[]): string {
    if (!parameters.length) {
      return template;
    }

    return parameters.reduce((value, parameter) => {
      if (parameter.value === null || parameter.value === undefined) {
        return value;
      }

      const token = `$${parameter.name}`;
      return value.split(token).join(String(parameter.value));
    }, template);
  }
}
