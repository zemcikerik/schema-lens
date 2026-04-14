import { computed, inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { DataModelingContextState } from './data-modeling-context.state';
import { TranslationParams } from '../core/translate/translate.types';
import { TranslatePipe } from '../core/translate/translate.pipe';

@Pipe({
  name: 'dataModelingTranslate',
  pure: true,
})
export class DataModelingTranslatePipe extends TranslatePipe implements PipeTransform {
  private contextState = inject(DataModelingContextState);

  override transform(key: string, params?: TranslationParams): Signal<string> {
    return computed(() => {
      const actualKey = key
        .replace('$layer', this.contextState.layer().toUpperCase())
        .replace('$context', this.contextState.context().toUpperCase());

      return super.transform(actualKey, params)();
    });
  }
}
