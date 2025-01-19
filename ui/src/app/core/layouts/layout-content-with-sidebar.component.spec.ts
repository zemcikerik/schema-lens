import { LayoutContentWithSidebarComponent } from './layout-content-with-sidebar.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { SidebarStateService } from './sidebar-state.service';

describe('LayoutContentWithSidebarComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(LayoutContentWithSidebarComponent)
    .keep(SidebarStateService));

  it('should be created', () => {
    const fixture = MockRender(LayoutContentWithSidebarComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should embed content and sidebar using content projection', () => {
    MockRender(`
      <app-layout-content-with-sidebar>
        <main>Hello, World!</main>
        <ng-container ngProjectAs="sidebar">Sidebar content</ng-container>
      </app-layout-content-with-sidebar>
    `);

    const content = ngMocks.find('.layout-content-with-sidebar__content main');
    expect(content).toBeTruthy();
    expect(ngMocks.formatText(content.nativeElement?.textContent)).toEqual('Hello, World!');

    const sidebar = ngMocks.find('.layout-content-with-sidebar__sidebar');
    expect(ngMocks.formatText(sidebar.nativeElement?.textContent)).toEqual('Sidebar content');
  });

  it('should register itself when rendered', () => {
    MockRender(LayoutContentWithSidebarComponent);
    const sidebarState = ngMocks.get(SidebarStateService);
    expect(sidebarState.hasSidebar()).toEqual(true);
  });

  it('should unregister itself when destroyed', () => {
    const component = MockRender(LayoutContentWithSidebarComponent).point.componentInstance;
    const sidebarState = ngMocks.get(SidebarStateService);

    component.ngOnDestroy();

    expect(sidebarState.hasSidebar()).toEqual(false);
  });

  it('should not be open by default', () => {
    MockRender(LayoutContentWithSidebarComponent);
    const layoutElement = ngMocks.find('.layout-content-with-sidebar').nativeElement as HTMLDivElement;
    expect(layoutElement.classList).not.toContain('is-open');
  });

  it('should be open when state changes externally', async () => {
    const fixture = MockRender(LayoutContentWithSidebarComponent);
    const layoutElement = ngMocks.find('.layout-content-with-sidebar').nativeElement as HTMLDivElement;
    const sidebarState = ngMocks.get(SidebarStateService);

    sidebarState.open();
    await fixture.whenRenderingDone();

    expect(layoutElement.classList).toContain('is-open');
  });
});
