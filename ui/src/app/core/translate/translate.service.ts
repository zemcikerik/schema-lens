import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { DescribedLocale, Translation, TranslationParams, Translations } from './translate.types';
import { TranslateLoaderService } from './translate-loader.service';
import { defer, map, mergeMap, Observable, of, tap } from 'rxjs';
import { KeyValueStoreService } from '../persistence/key-value-store.service';

const LOCALE_KEY = 'locale';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  private translateLoader = inject(TranslateLoaderService);
  private keyValueStoreService = inject(KeyValueStoreService);

  readonly _availableLocales = signal<DescribedLocale[]>([]);
  private _translations = signal<Translations>({});
  private _locale = signal<string>('');

  readonly availableLocales = this._availableLocales.asReadonly();
  readonly locale = this._locale.asReadonly();

  trySetLocaleFromStorageOrDefault(): Observable<unknown> {
    return this.loadAvailableLocalesIfNeeded().pipe(
      map(() => this.getLocaleFromStore() ?? this.getDefaultLocale()),
      mergeMap(locale => this.setLocale(locale)),
    );
  }

  translate(key: string, params?: TranslationParams): Signal<string> {
    return computed(() => {
      const translation: Translation | undefined = this._translations()[key];
      return translation ? translation(params) : key;
    });
  }

  setLocale(locale: string): Observable<boolean> {
    return this.loadAvailableLocalesIfNeeded().pipe(mergeMap(() => {
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
    }));
  }

  private loadAvailableLocalesIfNeeded(): Observable<unknown> {
    return defer(() => {
      if (this.availableLocales().length > 0) {
        return of(null);
      }

      return this.translateLoader.getAvailableLocales().pipe(
        tap(locales => this._availableLocales.set(locales)),
      );
    });
  }

  private getLocaleFromStore(): string | null {
    const locale = this.keyValueStoreService.getString(LOCALE_KEY);

    if (!locale) {
      return null;
    }

    if (this.isLocaleAvailable(locale)) {
      return locale;
    }

    this.keyValueStoreService.removeString(LOCALE_KEY);
    return null;
  }

  private getDefaultLocale(): string {
    return this.availableLocales()[0].locale;
  }

  private isLocaleAvailable(locale: string): boolean {
    return this.availableLocales().findIndex(l => l.locale === locale) !== -1;
  }

}
