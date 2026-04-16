import { inject, Pipe, PipeTransform } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelDataTypeResolver } from '../services/data-model-data-type.resolver';

@Pipe({
  name: 'dataModelDataType',
  pure: true,
})
export class DataModelDataTypePipe implements PipeTransform {
  private typeResolver = inject(DataModelDataTypeResolver);

  transform(typeId: number, types: DataModelDataType[]): string {
    return this.typeResolver.resolveFrom(typeId, types);
  }
}
