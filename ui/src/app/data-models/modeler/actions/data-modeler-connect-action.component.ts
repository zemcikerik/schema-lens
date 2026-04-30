import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { DataModelerState } from '../data-modeler.state';

@Component({
  selector: 'app-data-modeler-connect-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      class="data-modeler__connect-action"
      [class.toggled]="state.connectMode()"
      [matTooltip]="('DATA_MODEL.MODELER.ACTIONS.CONNECT_NODES_TOOLTIP' | translate)()"
      (click)="state.setConnectMode(!state.connectMode())"
    >
      <mat-icon>add_link</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip, TranslatePipe],
})
export class DataModelerConnectActionComponent {
  state = inject(DataModelerState);
}
