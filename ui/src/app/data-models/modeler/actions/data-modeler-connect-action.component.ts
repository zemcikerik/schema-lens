import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerTranslatePipe } from '../data-modeler-translate.pipe';

@Component({
  selector: 'app-data-modeler-connect-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      class="data-modeler__connect-action"
      [class.toggled]="active()"
      [matTooltip]="('DATA_MODELER.$type.ACTION.CONNECT' | dataModelerTranslate)()"
      (click)="active.set(!active())"
    >
      <mat-icon>add_link</mat-icon>
    </button>
  `,
  imports: [
    MatIconButton,
    MatIcon,
    MatTooltip,
    DataModelerTranslatePipe
  ],
})
export class DataModelerConnectActionComponent {
  active = model<boolean>(false);
}
