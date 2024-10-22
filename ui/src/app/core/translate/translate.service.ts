import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { Translation, TranslationParams, Translations } from './translate.types';
import { TranslateLoaderService } from './translate-loader.service';
import { TranslateParserService } from './translate-parser.service';
import { defer, map, Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  private translateLoader = inject(TranslateLoaderService);
  private translateParser = inject(TranslateParserService);

  private _translations = signal<Translations>({});
  private _locale = signal<string>('');
  readonly locale = this._locale.asReadonly();

  translate(key: string, params?: TranslationParams): Signal<string> {
    return computed(() => {
      const translation: Translation | undefined = this._translations()[key];
      return translation ? translation(params) : key;
    });
  }

  setLocale(locale: string): Observable<unknown> {
    return defer(() => {
      if (this.locale() === locale) {
        return of(true);
      }
      
      return this.translateLoader.loadRawTranslations(locale).pipe(
        map(rawTranslations => this.translateParser.parseRawTranslations(locale, rawTranslations)),
        tap(translations => {
          this._translations.set(translations);
          this._locale.set(locale);
        }),
      );
    });
  }

}
