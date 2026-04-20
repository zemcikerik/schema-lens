import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-modeler-verify-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button [matTooltip]="('DATA_MODEL.MODELER.ACTIONS.VERIFY_TOOLTIP' | translate)()">
      <mat-icon>domain_verification</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip, TranslatePipe],
})
export class DataModelerVerifyActionComponent {
}
