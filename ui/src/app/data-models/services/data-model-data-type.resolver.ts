import { Injectable } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';

@Injectable({ providedIn: 'root' })
export class DataModelDataTypeResolver {

  resolveFrom(typeId: number, types: DataModelDataType[]): string {
    return types.find(type => type.typeId === typeId)?.name ?? String(typeId);
  }
}
