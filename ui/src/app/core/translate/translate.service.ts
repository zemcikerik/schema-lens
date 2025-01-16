import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { Translation, TranslationParams, Translations } from './translate.types';
import { TranslateLoaderService } from './translate-loader.service';
import { defer, map, Observable, of, tap } from 'rxjs';
import { DescribedLocale } from '../models/described-locale.model';
import { KeyValueStoreService } from '../persistence/key-value-store.service';

const DEFAULT_LOCALE = 'en_US';
const LOCALE_KEY = 'locale';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  private translateLoader = inject(TranslateLoaderService);
  private keyValueStoreService = inject(KeyValueStoreService);

  readonly _availableLocales = signal<DescribedLocale[]>(this.translateLoader.getAvailableLocales());
  private _translations = signal<Translations>({});
  private _locale = signal<string>('');

  readonly availableLocales = this._availableLocales.asReadonly();
  readonly locale = this._locale.asReadonly();

  trySetLocaleFromStorageOrDefault(): Observable<unknown> {
    return defer(() => {
      const locale = this.getLocaleFromStore() ?? DEFAULT_LOCALE;
      return this.setLocale(locale);
    });
  }

  translate(key: string, params?: TranslationParams): Signal<string> {
    return computed(() => {
      const translation: Translation | undefined = this._translations()[key];
      return translation ? translation(params) : key;
    });
  }

  setLocale(locale: string): Observable<boolean> {
    return defer(() => {
      if (this.locale() === locale) {
        return of(true);
      }

      if (!this.isLocaleAvailable(locale)) {
        return of(false);
      }
      
      return this.translateLoader.loadTranslations(locale).pipe(
        tap(translations => {
          this._translations.set(translations);
          this._locale.set(locale);
          this.keyValueStoreService.setString(LOCALE_KEY, locale);
        }),
        map(() => true),
      );
    });
  }

  private getLocaleFromStore(): string | null {
    if (!this.keyValueStoreService.hasString(LOCALE_KEY)) {
      return null;
    }

    const locale = this.keyValueStoreService.getStringOrDefault(LOCALE_KEY, DEFAULT_LOCALE);

    if (this.isLocaleAvailable(locale)) {
      return locale;
    }

    this.keyValueStoreService.removeString(LOCALE_KEY);
    return null;
  }

  private isLocaleAvailable(locale: string): boolean {
    return this.availableLocales().findIndex(l => l.code === locale) !== -1;
  }

}
