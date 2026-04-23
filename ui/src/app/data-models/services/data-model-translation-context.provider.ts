import { computed, inject, Injectable, Signal } from '@angular/core';
import { TranslationContextProvider } from '../../core/translate/translate.types';
import { DataModelContextState } from '../data-model-context.state';

@Injectable({ providedIn: 'root' })
export class DataModelTranslationContextProvider implements TranslationContextProvider {
  private contextState = inject(DataModelContextState);

  private readonly context = computed(() => ({
    layer: this.contextState.layer(),
    context: this.contextState.context(),
  }));

  getContext(): Signal<Record<string, unknown>> {
    return this.context;
  }
}
