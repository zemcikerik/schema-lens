import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerTranslatePipe } from '../data-modeler-translate.pipe';

@Component({
  selector: 'app-data-modeler-verify-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [matTooltip]="('DATA_MODELER.$type.ACTION.VERIFY' | dataModelerTranslate)()">
      <mat-icon>domain_verification</mat-icon>
    </button>
  `,
  imports: [
    MatIconButton,
    MatIcon,
    MatTooltip,
    DataModelerTranslatePipe,
  ],
})
export class DataModelerVerifyActionComponent {
}
