import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(AlertComponent));

  it('should be created', () => {
    const component = MockRender(AlertComponent).point.componentInstance;
    expect(component).toBeTruthy();
  })

  it('should embed content using content projection', () => {
    MockRender(`
      <app-alert>
        <p>Hello, World!</p>
      </app-alert>
    `);

    const paragraph = ngMocks.find('.alert__content > p').nativeElement as HTMLParagraphElement;
    expect(paragraph).toBeTruthy();
    expect(ngMocks.formatText(paragraph.textContent ?? '')).toEqual('Hello, World!')
  });

  it('should not render icon when showIcon is set to false', () => {
    MockRender(AlertComponent, { showIcon: false });
    expect(ngMocks.find('.alert__icon', null)).toBeNull();
  });

  ['info', 'error'].forEach(type => describe(`${type} type`, () => {
    it('should render info alert', () => {
      MockRender(AlertComponent, { type });
      const alertElement = ngMocks.find('.alert').nativeElement as HTMLDivElement;
      expect(alertElement.classList).toContain(`alert--${type}`);
    });

    it('should render info icon', () => {
      MockRender(AlertComponent, { type, showIcon: true });
      const iconElement = ngMocks.find('.alert__icon').nativeElement as HTMLDivElement;
      expect(ngMocks.formatText(iconElement.textContent ?? '')).toEqual(type);
    });
  }));
});
