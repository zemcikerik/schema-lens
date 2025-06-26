import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Translations } from './translate.types';
import { TranslateHttpClientService } from './translate-http-client.service';
import { cacheObservable } from '../persistence/cache-observable.fn';

@Injectable({ providedIn: 'root' })
export class TranslateLoaderService {

  private translateHttpClient = inject(TranslateHttpClientService);

  getAvailableLocales = cacheObservable(() => {
    return this.translateHttpClient.getAvailableLocales();
  });

  loadTranslations = cacheObservable((locale: string): Observable<Translations> => {
    return this.translateHttpClient.getTranslationJsFor(locale).pipe(
      map(translationJs => new Function(translationJs)()),
    );
  });

}
