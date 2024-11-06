import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LOCAL_STORAGE } from './core/persistence/local-storage.token';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(
      withInterceptors([apiInterceptor]),
    ),
    provideMonacoEditor(),
    provideAnimationsAsync(),
    { provide: LOCAL_STORAGE, useFactory: () => window.localStorage },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
  ],
};
