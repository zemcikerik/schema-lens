import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslateHttpClientService } from "./translate-http-client.service";
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { lastValueFrom } from 'rxjs';
import { NO_AUTHORIZATION } from '../interceptors/jwt.interceptor';
import { IS_API_REQUEST } from '../interceptors/api.interceptor';

describe('TranslateHttpClientService', () => {
  let service: TranslateHttpClientService;
  let httpController: HttpTestingController;
  ngMocks.faster();

  beforeAll(() => MockBuilder(TranslateHttpClientService)
    .keep(provideHttpClient())
    .keep(provideHttpClientTesting()));

  beforeEach(() => {
    service = MockRender(TranslateHttpClientService).point.componentInstance;
    httpController = ngMocks.get(HttpTestingController);
  });

  afterEach(() => httpController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAvailableLocales should get available locales from i18n service', async () => {
    const localesPromise = lastValueFrom(service.getAvailableLocales());

    const req = httpController.expectOne('/i18n/translation');
    expect(req.request.method).toEqual('GET');
    expect(req.request.context.get(NO_AUTHORIZATION)).toEqual(true);
    expect(req.request.context.get(IS_API_REQUEST)).toEqual(false);
    req.flush(['en_US', 'sk_SK']);

    await expect(localesPromise).resolves.toEqual(['en_US', 'sk_SK']);
  });

  it('getTranslationJsFor should get translation js for provided locale', async () => {
    const expectedResponse = 'var translations = (() => ({}))();return translations;';
    const translationJsPromise = lastValueFrom(service.getTranslationJsFor('en_US'));

    const req = httpController.expectOne('/i18n/translation/en_US');
    expect(req.request.method).toEqual('GET');
    expect(req.request.context.get(NO_AUTHORIZATION)).toEqual(true);
    expect(req.request.context.get(IS_API_REQUEST)).toEqual(false);
    req.flush(expectedResponse);

    await expect(translationJsPromise).resolves.toEqual(expectedResponse);
  })
});
