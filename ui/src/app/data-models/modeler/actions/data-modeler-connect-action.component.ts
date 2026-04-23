import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-modeler-connect-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      class="data-modeler__connect-action"
      [class.toggled]="active()"
      [matTooltip]="('DATA_MODEL.MODELER.ACTIONS.CONNECT_NODES_TOOLTIP' | translate)()"
      (click)="active.set(!active())"
    >
      <mat-icon>add_link</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip, TranslatePipe],
})
export class DataModelerConnectActionComponent {
  active = model<boolean>(false);
}
