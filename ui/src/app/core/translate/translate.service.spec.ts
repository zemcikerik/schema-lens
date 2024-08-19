import { TranslateService } from './translate.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslateLoaderService } from './translate-loader.service';
import { lastValueFrom, of } from 'rxjs';
import { TranslateParserService } from './translate-parser.service';
import { Translations } from './translate.types';

describe('TranslateService', () => {
  let service: TranslateService;
  ngMocks.faster();

  beforeAll(() => MockBuilder(TranslateService)
    .mock(TranslateLoaderService, {
      loadRawTranslations: () => of({ RAW: 'yes' }),
    })
    .mock(TranslateParserService, {
      parseRawTranslations: () => ({ RAW: () => 'no' }),
    }));

  beforeEach(() => {
    service = MockRender(TranslateService).point.componentInstance;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setLanguage', () => {
    it('should load translations of provided language', async () => {
      const translateLoaderService = ngMocks.get(TranslateLoaderService);
      jest.spyOn(translateLoaderService, 'loadRawTranslations');

      const translateParserService = ngMocks.get(TranslateParserService);
      jest.spyOn(translateParserService, 'parseRawTranslations');

      await lastValueFrom(service.setLanguage('en'));
      expect(translateLoaderService.loadRawTranslations).toHaveBeenCalledWith('en');
      expect(translateParserService.parseRawTranslations).toHaveBeenCalledWith('en', { RAW: 'yes' });
      expect(service.translate('RAW')()).toEqual('no');
    });

    it('should not load translations of current language', async () => {
      await lastValueFrom(service.setLanguage('en'));
      const translateLoaderService = ngMocks.get(TranslateLoaderService);
      jest.spyOn(translateLoaderService, 'loadRawTranslations');

      await lastValueFrom(service.setLanguage('en'));

      expect(translateLoaderService.loadRawTranslations).not.toHaveBeenCalled();
    });
  });

  describe('translate', () => {
    const mockTranslations = async (translations: Translations, language = 'en') => {
      jest.spyOn(ngMocks.get(TranslateParserService), 'parseRawTranslations').mockReturnValue(translations);
      await lastValueFrom(service.setLanguage(language));
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

      await mockTranslations({ 'GREETING': () => 'Ahoj, svet!' }, 'sk');
      expect(result()).toEqual('Ahoj, svet!');
    });
  });
});
