import { inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { TranslationParams } from '../../core/translate/translate.types';
import { TranslatePipe } from '../../core/translate/translate.pipe';
import { DATA_MODELER_DEFINITION } from './data-modeler.definition';

@Pipe({
  name: 'dataModelerTranslate',
  pure: true,
})
export class DataModelerTranslatePipe extends TranslatePipe implements PipeTransform {

  private definition = inject(DATA_MODELER_DEFINITION);

  override transform(key: string, params?: TranslationParams): Signal<string> {
    const actualKey = key.replace('$type', this.definition.translationTypeReplacement);
    return super.transform(actualKey, params);
  }
}
