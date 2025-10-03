import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-admin-link',
  template: `
    <a 
      mat-icon-button
      [matTooltip]="('ADMIN.PANEL_LABEL' | translate)()"
      matTooltipPosition="below"
      [routerLink]="['/admin']"
    >
      <mat-icon>admin_panel_settings</mat-icon>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
  ],
})
export class AdminLinkComponent {
}
