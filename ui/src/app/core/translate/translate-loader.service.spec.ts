import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { TranslateLoaderService } from './translate-loader.service';
import { TranslateHttpClientService } from './translate-http-client.service';
import { lastValueFrom, of } from 'rxjs';
import { DescribedLocale } from './translate.types';

describe('TranslateLoaderService', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => MockBuilder(TranslateLoaderService)
    .mock(TranslateHttpClientService));

  const renderService = () => {
    return MockRender(TranslateLoaderService).point.componentInstance;
  };

  it('should be created', () => {
    expect(renderService()).toBeTruthy();
  });

  describe('getAvailableLocales', () => {
    const englishLocale: DescribedLocale = { title: 'English', locale: 'en_US' };

    beforeEach(() => {
      MockInstance(TranslateHttpClientService, 'getAvailableLocales', jest.fn(() => of([{ ...englishLocale }])));
    });

    it('should get available locales', async () => {
      const service = renderService();
      const getAvailableLocalesPromise = lastValueFrom(service.getAvailableLocales());
      await expect(getAvailableLocalesPromise).resolves.toEqual([englishLocale]);
      expect(ngMocks.get(TranslateHttpClientService).getAvailableLocales).toHaveBeenCalledTimes(1);
    });

    it('should cache result', async () => {
      const service = renderService();

      await lastValueFrom(service.getAvailableLocales());
      await lastValueFrom(service.getAvailableLocales());

      const getAvailableLocalesSpy = ngMocks.get(TranslateLoaderService).getAvailableLocales;
      expect(getAvailableLocalesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadTranslations', () => {
    const translationJs = `
      var translations = (() => ({
        FIRST: () => 'first',
        SECOND: c => \`second \${c.param}\`,
      }))();
      return translations;
    `;

    beforeEach(() => {
      MockInstance(TranslateHttpClientService, 'getTranslationJsFor', jest.fn(() => of(translationJs)));
    });

    it('should load translations for provided locale', async () => {
      const service = renderService();
      const translations = await lastValueFrom(service.loadTranslations('en_US'));

      expect(Object.keys(translations)).toEqual(['FIRST', 'SECOND']);
      expect(translations['FIRST']()).toEqual('first');
      expect(translations['SECOND']({ param: 'value' })).toEqual('second value');
      expect(ngMocks.get(TranslateHttpClientService).getTranslationJsFor).toHaveBeenCalledWith('en_US');
    });

    it('should cache result', async () => {
      const service = renderService();

      await lastValueFrom(service.loadTranslations('en_US'));
      await lastValueFrom(service.loadTranslations('sk_SK'));
      await lastValueFrom(service.loadTranslations('en_US'));

      const getTranslationJsForSpy = ngMocks.get(TranslateHttpClientService).getTranslationJsFor;
      expect(getTranslationJsForSpy).toHaveBeenCalledTimes(2);
      expect(getTranslationJsForSpy).toHaveBeenNthCalledWith(1, 'en_US');
      expect(getTranslationJsForSpy).toHaveBeenNthCalledWith(2, 'sk_SK');
    });
  });
});
