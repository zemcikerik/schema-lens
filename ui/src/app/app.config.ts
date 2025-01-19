import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LOCAL_STORAGE } from './core/persistence/local-storage.token';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { unauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(
      withInterceptors([apiInterceptor, jwtInterceptor, unauthorizedInterceptor]),
    ),
    provideAnimationsAsync(),
    { provide: LOCAL_STORAGE, useFactory: () => window.localStorage },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
  ],
};
