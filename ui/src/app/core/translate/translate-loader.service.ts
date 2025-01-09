import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defer, Observable, shareReplay, throwError } from 'rxjs';
import { RawTranslations } from './translate.types';

@Injectable({ providedIn: 'root' })
export class TranslateLoaderService {

  private httpClient = inject(HttpClient);
  private _translationCache: Record<string, Observable<RawTranslations>> = {};

  loadRawTranslations(locale: string): Observable<RawTranslations> {
    return defer(() => {
      if (locale in this._translationCache) {
        return this._translationCache[locale];
      }

      const translations$ = this.httpClient.get<RawTranslations>(`/static/translations/${locale}.json`).pipe(
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

}
