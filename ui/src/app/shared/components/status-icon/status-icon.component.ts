import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-status-icon',
  template: `<mat-icon>{{ status() ? 'check' : 'close' }}</mat-icon>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIcon],
})
export class StatusIconComponent {
  status = input.required<boolean>();
}
