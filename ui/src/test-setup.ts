import { ngMocks } from 'ng-mocks';
import { MockService } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});

ngMocks.autoSpy('jest');
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);
