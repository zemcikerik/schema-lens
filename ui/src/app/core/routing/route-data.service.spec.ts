import { MockBuilder, MockRender, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';
import { RouteDataService } from './route-data.service';
import { provideRouter, Routes } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';
import { DEFAULT_ROUTE_DATA } from '../models/route-data.model';

@Component({
  selector: 'app-dummy',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DummyComponent {
}

const testRoutes: Routes = [
  { path: '', component: DummyComponent, data: { disableTopBar: true } },
  { path: 'feature', component: DummyComponent },
  { path: 'navigation-disable', component: DummyComponent, data: { disableTopBar: true } },
  { path: 'navigation-enable', component: DummyComponent, data: { disableTopBar: false } },
  {
    path: 'parent',
    component: DummyComponent,
    data: { disableTopBar: false },
    children: [
      { path: 'child', component: DummyComponent, data: { disableTopBar: true } }
    ]
  }
];

describe('RouteDataService', () => {
  let service: RouteDataService;
  let routerHarness: RouterTestingHarness;

  beforeEach(() => MockBuilder(RouteDataService)
    .keep(provideRouter(testRoutes))
    .keep(provideLocationMocks())
    .keep(NG_MOCKS_ROOT_PROVIDERS));

  const setup = async (initialLocation: string): Promise<void> => {
    service = MockRender(RouteDataService).point.componentInstance;
    routerHarness = await RouterTestingHarness.create(initialLocation);
  };

  it('should return default data if route has no data specified', async () => {
    await setup('/feature');
    expect(service.routeData()).toEqual(DEFAULT_ROUTE_DATA);
  });

  it('should return route data if route has specified data', async () => {
    await setup('/');
    expect(service.routeData()).toEqual({ disableTopBar: true });
  });

  it('should update route data based on navigation', async () => {
    await setup('/navigation-disable');
    expect(service.routeData()).toEqual({ disableTopBar: true });
    await routerHarness.navigateByUrl('/navigation-enable')
    expect(service.routeData()).toEqual({ disableTopBar: false });
  });

  it('should handle data overrides by children', async () => {
    await setup('/parent/child');
    expect(service.routeData()).toEqual({ disableTopBar: true });
  });
});
