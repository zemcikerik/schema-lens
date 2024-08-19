import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, defer, Observable, shareReplay, throwError } from 'rxjs';
import { RawTranslations } from './translate.types';

@Injectable({ providedIn: 'root' })
export class TranslateLoaderService {

  private httpClient = inject(HttpClient);
  private _translationCache: Record<string, Observable<RawTranslations>> = {};

  loadRawTranslations(languageKey: string): Observable<RawTranslations> {
    return defer(() => {
      if (languageKey in this._translationCache) {
        return this._translationCache[languageKey];
      }

      const translations$ = this.httpClient.get<RawTranslations>(`./translations/${languageKey}.json`).pipe(
        catchError(err => {
          delete this._translationCache[languageKey];
          return throwError(() => err);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

      this._translationCache[languageKey] = translations$;
      return translations$;
    });
  }

}
