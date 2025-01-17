import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-icon-link',
  template: `
    <a mat-icon-button [routerLink]="targetRouterLink()" [matTooltip]="(tooltipKey() | translate)()">
      <mat-icon>{{ icon() }}</mat-icon>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconAnchor,
    MatIcon,
    RouterLink,
    MatTooltip,
    TranslatePipe,
  ],
})
export class IconLinkComponent {
  icon = input.required<string>();
  targetRouterLink = input.required<string[]>();
  tooltipKey = input.required<string>();
}
