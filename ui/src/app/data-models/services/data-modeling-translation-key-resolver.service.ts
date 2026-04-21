import { inject, Injectable } from '@angular/core';
import { DataModelingContextState } from '../data-modeling-context.state';

@Injectable({ providedIn: 'root' })
export class DataModelingTranslationKeyResolver {
  private contextState = inject(DataModelingContextState);

  resolveKey(key: string): string {
    return key
      .replace('$layer', this.contextState.layer().toUpperCase())
      .replace('$context', this.contextState.context().toUpperCase());
  }
}
