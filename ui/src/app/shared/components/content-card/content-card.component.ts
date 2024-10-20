import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-content-card',
  template: `
    <div class="content-card">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ContentCardComponent {
}
