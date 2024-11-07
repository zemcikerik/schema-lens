import {
  PROGRESS_SPINNER_DIAMETER_LARGE,
  PROGRESS_SPINNER_DIAMETER_SMALL,
  ProgressSpinnerComponent,
  ProgressSpinnerSize,
} from './progress-spinner.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

describe('ProgressSpinnerComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(ProgressSpinnerComponent));

  const render = (size?: ProgressSpinnerSize): ProgressSpinnerComponent =>
    MockRender(ProgressSpinnerComponent, { size }).point.componentInstance;

  it('should be created', () => {
    expect(render()).toBeTruthy();
  });

  it('should show small progress spinner', () => {
    expect(render('small').diameter()).toEqual(PROGRESS_SPINNER_DIAMETER_SMALL);
  });

  it('should show large progress spinner', () => {
    expect(render('large').diameter()).toEqual(PROGRESS_SPINNER_DIAMETER_LARGE);
  });
});
