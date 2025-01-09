import { TranslateLoaderService } from './translate-loader.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';

describe('TranslateLoaderService', () => {
  let service: TranslateLoaderService;
  let httpController: HttpTestingController;
  ngMocks.faster();

  beforeAll(() => MockBuilder(TranslateLoaderService)
    .provide(provideHttpClient())
    .provide(provideHttpClientTesting()));

  beforeEach(() => {
    service = MockRender(TranslateLoaderService).point.componentInstance;
    httpController = ngMocks.get(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load translations using http client', async () => {
    const translationPromise = lastValueFrom(service.loadRawTranslations('en_US'));

    const req = httpController.expectOne('./static/translations/en_US.json');
    expect(req.request.method).toEqual('GET');
    req.flush({ key: 'value' });

    expect(await translationPromise).toEqual({ key: 'value' });
  });

  it('should cache loaded translations', async () => {
    const translationPromise = lastValueFrom(service.loadRawTranslations('en_GB'));
    httpController.expectOne('./static/translations/en_GB.json').flush({ cached: 'Cached!' });
    await translationPromise;

    const cachedPromise = lastValueFrom(service.loadRawTranslations('en_GB'));
    httpController.expectNone('./static/translations/en_GB.json');
    expect(await cachedPromise).toEqual({ cached: 'Cached!' });
  });

  it('should expunge errored responses from cache', async () => {
    const translationPromise = lastValueFrom(service.loadRawTranslations('de_DE'));
    httpController.expectOne('./static/translations/de_DE.json').flush(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(translationPromise).rejects.toHaveProperty('status', 500);

    const repeatedPromise = lastValueFrom(service.loadRawTranslations('de_DE'));
    httpController.expectOne('./static/translations/de_DE.json').flush({});
    expect(await repeatedPromise).toEqual({});
  });
});
