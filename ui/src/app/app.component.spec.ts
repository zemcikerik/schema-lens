import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { AppComponent } from './app.component';
import { TranslateService } from './core/translate/translate.service';
import { of, Subject } from 'rxjs';
import { ProjectService } from './projects/services/project.service';
import { ProgressSpinnerComponent } from './shared/components/progress-spinner/progress-spinner.component';
import { RouteDataService } from './core/routing/route-data.service';
import { signal } from '@angular/core';
import { DEFAULT_ROUTE_DATA, RouteData } from './core/models/route-data.model';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/components/alert/alert.component';
import { TopBarComponent } from './top-bar.component';
import { AuthService } from './core/auth/auth.service';

describe('AppComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => MockBuilder(AppComponent)
    .mock(TranslateService, {
      setLocale: () => of(null),
    })
    .mock(ProjectService, {
      loadProjects: () => of(null),
    })
    .mock(RouteDataService, {
      routeData: signal({ ...DEFAULT_ROUTE_DATA })
    })
    .mock(AuthService, {
      attemptAuthFromStorage: () => of(true),
      currentUser: signal(null)
    }));

  it('should be created', () => {
    expect(MockRender(AppComponent).point.componentInstance).toBeTruthy();
  });

  it('should set translation locale', () => {
    const setLocaleSpy = jest.fn(() => of(null));
    MockInstance(TranslateService, 'setLocale', setLocaleSpy);
    MockRender(AppComponent);
    expect(setLocaleSpy).toHaveBeenCalled();
  });

  it('should preload projects', () => {
    const loadProjectsSpy = jest.fn(() => of(null));
    MockInstance(ProjectService, 'loadProjects', loadProjectsSpy);
    MockRender(AppComponent);
    expect(loadProjectsSpy).toHaveBeenCalled();
  });

  it('should show loading spinner while initialization is running', () => {
    const loadProjects$ = new Subject();
    MockInstance(ProjectService, 'loadProjects', () => loadProjects$.asObservable());

    const fixture = MockRender(AppComponent);
    expect(ngMocks.find(ProgressSpinnerComponent)).toBeTruthy();
    expect(ngMocks.find(RouterOutlet, null)).toBeNull();

    loadProjects$.next(null);
    loadProjects$.complete();
    fixture.detectChanges();
    expect(ngMocks.find(ProgressSpinnerComponent, null)).toBeNull();
    expect(ngMocks.find(RouterOutlet)).toBeTruthy();
  });

  it('should show error alert when error was emitted during initialization', () => {
    const setLocale$ = new Subject();
    MockInstance(TranslateService, 'setLocale', () => setLocale$.asObservable());

    const fixture = MockRender(AppComponent);
    expect(ngMocks.find(AlertComponent, null)).toBeNull();

    setLocale$.error(new Error('test error'));
    fixture.detectChanges();
    expect(ngMocks.find(AlertComponent)).toBeTruthy();
  });

  it('should render top bar conditionally when it is not disabled by route data', () => {
    const routeDataMock = signal<RouteData>({ ...DEFAULT_ROUTE_DATA, disableTopBar: false });
    MockInstance(RouteDataService, 'routeData', routeDataMock.asReadonly());

    const fixture = MockRender(AppComponent);
    expect(ngMocks.find(TopBarComponent)).toBeTruthy();

    routeDataMock.update(data => ({ ...data, disableTopBar: true }));
    fixture.detectChanges();
    expect(ngMocks.find(TopBarComponent, null)).toBeNull();
  });
});
