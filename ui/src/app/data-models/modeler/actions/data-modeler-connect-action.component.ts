import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelingTranslatePipe } from '../../data-modeling-translate.pipe';

@Component({
  selector: 'app-data-modeler-connect-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      class="data-modeler__connect-action"
      [class.toggled]="active()"
      [matTooltip]="('DATA_MODEL.MODELER.ACTIONS.$layer.CONNECT_NODES_TOOLTIP' | dataModelingTranslate)()"
      (click)="active.set(!active())"
    >
      <mat-icon>add_link</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip, DataModelingTranslatePipe],
})
export class DataModelerConnectActionComponent {
  active = model<boolean>(false);
}
