import { inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { TranslationParams } from './translate.types';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: true,
})
export class TranslatePipe implements PipeTransform {

  private translateService = inject(TranslateService);

  transform(key: string, params?: TranslationParams): Signal<string> {
    return this.translateService.translate(key, params);
  }

}
