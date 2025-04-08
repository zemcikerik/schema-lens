import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-layout-header-and-content',
  template: `
    <div class="layout-header-and-content" [class.include-spacing]="includeSpacing()" [class.full-height]="fullHeight()">
      <div class="layout-header-and-content__header">
        <h2>{{ title() }}</h2>
        <ng-content select="header-action" />
      </div>
      <div class="layout-header-and-content__content">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeaderAndContentComponent {
  title = input.required<string>();
  includeSpacing = input<boolean>(false);
  fullHeight = input<boolean>(false);
}
