import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-content-card',
  template: `
    <div class="content-card" [class.dim]="background() === 'dim'">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentCardComponent {
  background = input<'regular' | 'dim'>('regular');
}
