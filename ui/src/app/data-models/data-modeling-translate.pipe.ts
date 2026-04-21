import { computed, inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { TranslationParams } from '../core/translate/translate.types';
import { TranslatePipe } from '../core/translate/translate.pipe';
import { DataModelingTranslationKeyResolver } from './services/data-modeling-translation-key-resolver.service';

@Pipe({
  name: 'dataModelingTranslate',
  pure: true,
})
export class DataModelingTranslatePipe extends TranslatePipe implements PipeTransform {
  private keyResolver = inject(DataModelingTranslationKeyResolver);

  override transform(key: string, params?: TranslationParams): Signal<string> {
    return computed(() => {
      const resolvedKey = this.keyResolver.resolveKey(key);
      return super.transform(resolvedKey, params)();
    });
  }
}
