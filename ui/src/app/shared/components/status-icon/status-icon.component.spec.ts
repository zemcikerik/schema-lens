import { StatusIconComponent } from './status-icon.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { MatIcon } from '@angular/material/icon';

describe('StatusIconComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(StatusIconComponent));

  const expectIcon = () => {
    const element: HTMLElement = ngMocks.find(MatIcon).nativeElement;
    return expect(ngMocks.formatHtml(element.innerHTML));
  };

  it('should be created', () => {
    const fixture = MockRender(StatusIconComponent, { status: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render true status icon', () => {
    MockRender(StatusIconComponent, { status: true });
    expectIcon().toEqual('check');
  });

  it('should render false status icon', () => {
    MockRender(StatusIconComponent, { status: false });
    expectIcon().toEqual('close');
  });
});
