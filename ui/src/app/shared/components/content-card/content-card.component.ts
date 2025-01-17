import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-content-card',
  template: `
    <div class="content-card">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentCardComponent {
}
