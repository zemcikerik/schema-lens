import { EMPHASIS_HIGH_CLASS, IconEmphasisDirective } from './icon-emphasis.directive';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

describe('IconEmphasisDirective', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(IconEmphasisDirective));

  const expectIconClasses = () => {
    const iconElement: HTMLElement = ngMocks.find('i').nativeElement;
    return expect(iconElement.classList);
  };

  it('should be created', () => {
    MockRender('<i appIconEmphasis="high"></i>');
    expect(ngMocks.find(IconEmphasisDirective)).toBeTruthy();
  });

  it('should add high emphasis class', () => {
    MockRender('<i appIconEmphasis="high"></i>');
    expectIconClasses().toContain(EMPHASIS_HIGH_CLASS);
  });

  it('should not add high emphasis class', () => {
    MockRender('<i appIconEmphasis="default"></i>');
    expectIconClasses().not.toContain(EMPHASIS_HIGH_CLASS);
  });

  it('should react to emphasis change', () => {
    const fixture = MockRender('<i [appIconEmphasis]="emphasis"></i>', {
      emphasis: 'high'
    });
    const inputs = fixture.componentInstance;
    expectIconClasses().toContain(EMPHASIS_HIGH_CLASS);

    inputs.emphasis = 'default';
    fixture.detectChanges();
    expectIconClasses().not.toContain(EMPHASIS_HIGH_CLASS);

    inputs.emphasis = 'high';
    fixture.detectChanges();
    expectIconClasses().toContain(EMPHASIS_HIGH_CLASS);
  });
});
