import { TranslateService } from './translate.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslateLoaderService } from './translate-loader.service';
import { lastValueFrom, of } from 'rxjs';
import { Translations } from './translate.types';
import { KeyValueStoreService } from '../persistence/key-value-store.service';

describe('TranslateService', () => {
  let service: TranslateService;
  ngMocks.faster();

  beforeAll(() => MockBuilder(TranslateService)
    .mock(TranslateLoaderService, {
      getAvailableLocales: () => [
        { name: 'English', code: 'en_US' },
        { name: 'Slovensky', code: 'sk_SK' },
      ],
      loadTranslations: () => of({ KEY: () => 'test' }),
    })
    .mock(KeyValueStoreService, {
      getStringOrDefault: () => 'en_US',
      hasString: () => false,
      removeString: () => void 0,
    }));

  beforeEach(() => {
    service = MockRender(TranslateService).point.componentInstance;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setLocale', () => {
    it('should load translations for provided locale', async () => {
      const translateLoaderService = ngMocks.get(TranslateLoaderService);
      jest.spyOn(translateLoaderService, 'loadTranslations');

      await lastValueFrom(service.setLocale('en_US'));
      expect(translateLoaderService.loadTranslations).toHaveBeenCalledWith('en_US');
      expect(service.translate('KEY')()).toEqual('test');
    });

    it('should not load translations of current language', async () => {
      await lastValueFrom(service.setLocale('en_US'));
      const translateLoaderService = ngMocks.get(TranslateLoaderService);
      jest.spyOn(translateLoaderService, 'loadTranslations');

      await lastValueFrom(service.setLocale('en_US'));

      expect(translateLoaderService.loadTranslations).not.toHaveBeenCalled();
    });
  });

  describe('translate', () => {
    const mockTranslations = async (translations: Translations, locale = 'en_US') => {
      jest.spyOn(ngMocks.get(TranslateLoaderService), 'loadTranslations').mockReturnValue(of(translations));
      await lastValueFrom(service.setLocale(locale));
    };

    it('should translate provided key', async () => {
      await mockTranslations({ 'TEST_KEY': () => 'translated value' });
      expect(service.translate('TEST_KEY')()).toEqual('translated value');
    });

    it('should translate provided key with params', async () => {
      const translationSpy = jest.fn(() => 'spied');
      await mockTranslations({ 'SPIED_KEY': translationSpy });

      expect(service.translate('SPIED_KEY', { param: 'param' })()).toEqual('spied');
      expect(translationSpy).toHaveBeenCalledWith({ param: 'param' });
    });

    it('should return key if translation with provided key does not exist', () => {
      expect(service.translate('UNKNOWN')()).toEqual('UNKNOWN');
    });

    it('should update returned translation when language is changed', async () => {
      await mockTranslations({ 'GREETING': () => 'Hello, World!' });

      const result = service.translate('GREETING');
      expect(result()).toEqual('Hello, World!');

      await mockTranslations({ 'GREETING': () => 'Ahoj, svet!' }, 'sk_SK');
      expect(result()).toEqual('Ahoj, svet!');
    });
  });
});
