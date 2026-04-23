import { computed, inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { TRANSLATION_CONTEXT, TranslationContextProvider, TranslationParams } from './translate.types';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: true,
})
export class TranslatePipe implements PipeTransform {
  private translateService = inject(TranslateService);
  private contextProviders: TranslationContextProvider[] = inject(TRANSLATION_CONTEXT, { optional: true }) ?? [];

  private context = computed(() =>
    this.contextProviders.reduce<Record<string, unknown>>((acc, provider) =>
      ({ acc, ...provider.getContext()() }), {}));

  transform(key: string, params?: TranslationParams): Signal<string> {
    if (this.contextProviders.length === 0) {
      return this.translateService.translate(key, params);
    }

    return computed(() => {
      const actualParams = { ...this.context(), ...params };
      return this.translateService.translate(key, actualParams)();
    });
  }
}
