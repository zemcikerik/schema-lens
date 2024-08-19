import { TranslatePipe } from './translate.pipe';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslateService } from './translate.service';
import { computed } from '@angular/core';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  ngMocks.faster();

  beforeAll(() => MockBuilder(TranslatePipe)
    .provide(TranslatePipe)
    .mock(TranslateService, {
      translate: key => computed(() => `translated:${key}`),
    }));

  beforeEach(() => {
    pipe = MockRender(TranslatePipe).point.componentInstance;
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should translate key with params using translate service', () => {
    const translateService = ngMocks.get(TranslateService);
    jest.spyOn(translateService, 'translate');

    const key = 'key';
    const params = { only: 'param' };
    const result = pipe.transform(key, params);

    expect(result()).toEqual('translated:key');
    expect(ngMocks.get(TranslateService).translate).toHaveBeenCalledWith(key, params);
  });
});
