import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

export type ProgressSpinnerSize = 'small' | 'large';

export const PROGRESS_SPINNER_DIAMETER_SMALL = 24;
export const PROGRESS_SPINNER_DIAMETER_LARGE = 72;

export const PROGRESS_SPINNER_SIZE_TO_DIAMETER: Record<ProgressSpinnerSize, number> = {
  'small': PROGRESS_SPINNER_DIAMETER_SMALL,
  'large': PROGRESS_SPINNER_DIAMETER_LARGE,
};

@Component({
  selector: 'app-progress-spinner',
  template: `
    @if (center()) {
      <div class="progress-spinner__center-wrapper">
        <mat-progress-spinner [diameter]="diameter()" mode="indeterminate" />
      </div>
    } @else {
      <mat-progress-spinner [diameter]="diameter()" mode="indeterminate" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinner],
})
export class ProgressSpinnerComponent {
  size = input<ProgressSpinnerSize>('large');
  center = input<boolean>(false);
  diameter = computed(() => PROGRESS_SPINNER_SIZE_TO_DIAMETER[this.size()]);
}
