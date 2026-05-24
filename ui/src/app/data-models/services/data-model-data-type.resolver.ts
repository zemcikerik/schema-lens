import { Injectable } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelingContext } from '../data-model-context.state';

@Injectable({ providedIn: 'root' })
export class DataModelDataTypeResolver {

  resolveFrom(typeId: number, types: DataModelDataType[]): string {
    return types.find(type => type.typeId === typeId)?.name ?? String(typeId);
  }

  resolveFromContext(
    typeId: number,
    types: DataModelDataType[],
    context: DataModelingContext,
    parameters?: { name: string; value: number | null }[] | null,
  ): string {
    const type = types.find(entry => entry.typeId === typeId);

    if (!type) {
      return String(typeId);
    }

    const template = context === 'oracle'
      ? type.mappings?.find(mapping => mapping.dbSystem === context)?.physicalDataType ?? '-'
      : type.name;

    return this.applyParameters(template, parameters);
  }

  private applyParameters(template: string, parameters?: { name: string; value: number | null }[] | null): string {
    if (!parameters?.length) {
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
