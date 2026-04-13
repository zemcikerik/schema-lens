import { computed, inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { DataModelingContext } from './data-modeling.context';
import { TranslationParams } from '../core/translate/translate.types';
import { TranslatePipe } from '../core/translate/translate.pipe';

@Pipe({
  name: 'dataModelingTranslate',
  pure: true,
})
export class DataModelingTranslatePipe extends TranslatePipe implements PipeTransform {
  private modelingContext = inject(DataModelingContext);

  override transform(key: string, params?: TranslationParams): Signal<string> {
    return computed(() => {
      const actualKey = key.replace('$layer', this.modelingContext.layer());
      return super.transform(actualKey, params)();
    });
  }
}
