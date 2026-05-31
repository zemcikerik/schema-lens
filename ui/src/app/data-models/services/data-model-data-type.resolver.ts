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

    const valuesByToken = new Map(
      parameters
        .filter(parameter => parameter.value !== null && parameter.value !== undefined)
        .map(parameter => [`$${parameter.name}`, String(parameter.value)]),
    );

    if (valuesByToken.size === 0) {
      return template;
    }

    const tokenPattern = [...valuesByToken.keys()]
      .sort((a, b) => b.length - a.length)
      .map(token => this.escapeRegex(token))
      .join('|');

    return template.replace(new RegExp(tokenPattern, 'g'), token => valuesByToken.get(token) ?? token);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
