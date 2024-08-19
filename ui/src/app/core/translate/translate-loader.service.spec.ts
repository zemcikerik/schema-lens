import { TranslateLoaderService } from './translate-loader.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
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
    const translationPromise = lastValueFrom(service.loadRawTranslations('en'));

    const req = httpController.expectOne('./translations/en.json');
    expect(req.request.method).toEqual('GET');
    req.flush({ key: 'value' });

    expect(await translationPromise).toEqual({ key: 'value' });
  });

  it('should cache loaded translations', async () => {
    const translationPromise = lastValueFrom(service.loadRawTranslations('en'));
    httpController.expectOne('./translations/en.json').flush({ cached: 'Cached!' });
    await translationPromise;

    const cachedPromise = lastValueFrom(service.loadRawTranslations('en'));
    httpController.expectNone('./translations/en.json');
    expect(await cachedPromise).toEqual({ cached: 'Cached!' });
  });

  it('should expunge errored responses from cache', async () => {
    const translationPromise = lastValueFrom(service.loadRawTranslations('de'));
    httpController.expectOne('./translations/de.json').flush(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    let exceptionTriggered = false;
    try {
      await translationPromise;
    } catch (err: unknown) {
      exceptionTriggered = true;
      expect((err as HttpErrorResponse).status).toEqual(500);
    }

    if (!exceptionTriggered) {
      throw new Error('Expected translation promise to throw!');
    }

    const repeatedPromise = lastValueFrom(service.loadRawTranslations('de'));
    httpController.expectOne('./translations/de.json').flush({});
    expect(await repeatedPromise).toEqual({});
  });
});
