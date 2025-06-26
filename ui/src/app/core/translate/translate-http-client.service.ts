import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DescribedLocale } from './translate.types';
import { IS_API_REQUEST } from '../interceptors/api.interceptor';
import { NO_AUTHORIZATION } from '../interceptors/jwt.interceptor';

@Injectable({ providedIn: 'root' })
export class TranslateHttpClientService {

  private httpClient = inject(HttpClient);

  getAvailableLocales(): Observable<DescribedLocale[]> {
    return this.httpClient.get<DescribedLocale[]>('/i18n/translation', { context: this.createI18nContext() });
  }

  getTranslationJsFor(localeOrResourceId: string): Observable<string> {
    return this.httpClient.get(`/i18n/translation/${localeOrResourceId}`, {
      context: this.createI18nContext(),
      responseType: 'text',
    });
  }

  private createI18nContext(): HttpContext {
    const context = new HttpContext();
    context.set(IS_API_REQUEST, false);
    context.set(NO_AUTHORIZATION, true);
    return context;
  }

}
