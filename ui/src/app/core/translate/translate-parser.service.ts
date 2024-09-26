import { Injectable } from '@angular/core';
import { RawTranslations, Translations } from './translate.types';
import MessageFormat from '@messageformat/core';

@Injectable({ providedIn: 'root' })
export class TranslateParserService {

  private _messageFormatCache: Record<string, MessageFormat<'string'>> = {};

  parseRawTranslations(locale: string, rawTranslations: RawTranslations): Translations {
    return this.parseTranslationsRecursively(this.getMessageFormatFor(locale), rawTranslations);
  }

  private parseTranslationsRecursively(format: MessageFormat<'string'>, rawTranslations: RawTranslations): Translations {
    const translations: Translations = {};

    Object.entries(rawTranslations).forEach(([key, value]) => {
      if (typeof value === 'object') {
        const childTranslations = this.parseTranslationsRecursively(format, value);
        this.mergeWithChildTranslations(translations, key, childTranslations);
      } else {
        translations[key] = format.compile(value);
      }
    });

    return translations;
  }

  private mergeWithChildTranslations(translations: Translations, parentKey: string, childTranslations: Translations): void {
    Object.entries(childTranslations).forEach(([key, value]) => {
      translations[`${parentKey}.${key}`] = value;
    });
  }

  private getMessageFormatFor(locale: string): MessageFormat<'string'> {
    const country = this.extractLanguageFrom(locale);

    if (country in this._messageFormatCache) {
      return this._messageFormatCache[country];
    }

    const messageFormat = new MessageFormat(country);
    this._messageFormatCache[country] = messageFormat;
    return messageFormat;
  }

  private extractLanguageFrom(locale: string): string {
    return locale.split('_')[0];
  }

}
