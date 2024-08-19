// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';

import { ngMocks } from 'ng-mocks';
import { MockService } from 'ng-mocks';
import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

ngMocks.autoSpy('jest');
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);
