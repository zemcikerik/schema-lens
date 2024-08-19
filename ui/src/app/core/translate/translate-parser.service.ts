import { Injectable } from '@angular/core';
import { RawTranslations, Translations } from './translate.types';
import MessageFormat from '@messageformat/core';

@Injectable({ providedIn: 'root' })
export class TranslateParserService {

  private _messageFormatCache: Record<string, MessageFormat<'string'>> = {};

  parseRawTranslations(languageKey: string, rawTranslations: RawTranslations): Translations {
    return this.parseTranslationsRecursively(this.getMessageFormatFor(languageKey), rawTranslations);
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

  private getMessageFormatFor(languageKey: string): MessageFormat<'string'> {
    if (languageKey in this._messageFormatCache) {
      return this._messageFormatCache[languageKey];
    }

    const messageFormat = new MessageFormat(languageKey);
    this._messageFormatCache[languageKey] = messageFormat;
    return messageFormat;
  }

}
