import { Injectable } from '@angular/core';
import { catchError, defer, Observable, shareReplay, throwError } from 'rxjs';
import { Translations } from './translate.types';
import { DescribedLocale } from '../models/described-locale.model';

@Injectable({ providedIn: 'root' })
export class TranslateLoaderService {

  private _translationCache: Record<string, Observable<Translations>> = {};

  getAvailableLocales(): DescribedLocale[] {
    return [
      { name: 'English', code: 'en_US' },
      { name: 'Slovensky', code: 'sk_SK' },
    ];
  }

  loadTranslations(locale: string): Observable<Translations> {
    return defer(() => {
      if (locale in this._translationCache) {
        return this._translationCache[locale];
      }

      const translations$ = this.loadLocale(locale).pipe(
        catchError(err => {
          delete this._translationCache[locale];
          return throwError(() => err);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

      this._translationCache[locale] = translations$;
      return translations$;
    });
  }

  private loadLocale(locale: string): Observable<Translations> {
    if (locale === 'en_US') {
      return defer(() => this.unwrap(import(`../../../translations/en_US.json`)));
    }

    if (locale === 'sk_SK') {
      return defer(() => this.unwrap(import(`../../../translations/sk_SK.json`)));
    }

    throw new Error('Unsupported locale');
  }

  private unwrap(promise: Promise<{ default: unknown }>): Promise<Translations> {
    return promise.then(d => d.default) as Promise<Translations>;
  }

}
