import { computed, inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelDataTypeResolver } from '../services/data-model-data-type.resolver';
import { DataModelContextState } from '../data-model-context.state';
import { DataModelFieldDataTypeParameter } from '../models/data-model-node.model';

@Pipe({
  name: 'dataModelDataType',
  pure: true,
})
export class DataModelDataTypePipe implements PipeTransform {
  private typeResolver = inject(DataModelDataTypeResolver);
  private contextState = inject(DataModelContextState);

  transform(typeId: number, ctx: { types: DataModelDataType[], parameters: DataModelFieldDataTypeParameter[] }): Signal<string> {
    const { types, parameters } = ctx;
    return computed(() => this.typeResolver.resolveFromContext(typeId, types, this.contextState.context(), parameters));
  }
}
